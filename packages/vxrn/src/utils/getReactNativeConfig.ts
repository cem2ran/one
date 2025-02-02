import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@babel/core'
import viteNativeSWC, { swcTransform } from '@vxrn/vite-native-swc'
import { createDebugger } from '@vxrn/debug'
import { stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
  type InlineConfig,
  type Plugin,
  resolveConfig,
  type ResolvedConfig,
  transformWithEsbuild,
  type UserConfig,
} from 'vite'
import { DEFAULT_ASSET_EXTS } from '../constants/defaults'
import { getBabelReanimatedPlugin } from '../plugins/babelReanimated'
import { nativeClientInjectPlugin } from '../plugins/clientInjectPlugin'
import { reactNativeCommonJsPlugin } from '../plugins/reactNativeCommonJsPlugin'
import { reactNativeDevAssetPlugin } from '../plugins/reactNativeDevAssetPlugin'
import { dedupe } from './getBaseViteConfig'
import { getOptimizeDeps } from './getOptimizeDeps'
import type { VXRNOptionsFilled } from './getOptionsFilled'
import { swapPrebuiltReactModules } from './swapPrebuiltReactModules'

// Suppress these logs:
// * Use of eval in "(...)/react-native-prebuilt/vendor/react-native-0.74.1/index.js" is strongly discouraged as it poses security risks and may cause issues with minification.
// * Use of eval in "(...)/one/dist/esm/useLoader.native.js" is strongly discouraged as it poses security risks and may cause issues with minification.
// (not an exhaustive list)
const IGNORE_ROLLUP_LOGS_RE =
  /vite-native-client\/dist\/esm\/client|node_modules\/\.vxrn\/react-native|react-native-prebuilt\/vendor|one\/dist/

const NATIVE_COMPONENT_RE = /NativeComponent\.[jt]sx?$/
const SPEC_FILE_RE = /[\/\\]specs?[\/\\]/

const { debug: reactNativeCodegenDebug } = createDebugger('vxrn:react-native-codegen')

export async function getReactNativeConfig(
  options: VXRNOptionsFilled,
  internal: { mode?: 'dev' | 'prod'; assetsDest?: string } = { mode: 'dev' },
  platform: 'ios' | 'android'
) {
  const {
    root,
    server: { port },
  } = options
  const { optimizeDeps } = getOptimizeDeps('build')

  const { mode } = internal
  const serverUrl = process.env.ONE_SERVER_URL || options.server.url

  // build app
  let nativeBuildConfig = {
    plugins: [
      ...(globalThis.__vxrnAddNativePlugins || []),

      ...(mode === 'dev' ? [nativeClientInjectPlugin()] : []),

      // vite doesnt support importing from a directory but its so common in react native
      // so lets make it work, and node resolve theoretically fixes but you have to pass in moduleDirs
      // but we need this to work anywhere including in normal source files
      {
        name: 'node-dir-imports',
        enforce: 'pre',

        async resolveId(importee, importer) {
          if (!importer || !importee.startsWith('./')) {
            return null
          }
          // let nodeResolve handle node_modules
          if (importer?.includes('node_modules')) {
            return
          }
          try {
            const resolved = join(dirname(importer), importee)
            if ((await stat(resolved)).isDirectory()) {
              // fix for importing a directory
              // TODO this would probably want to support their configured extensions
              // TODO also platform-specific extensions
              for (const ext of ['ts', 'tsx', 'mjs', 'js']) {
                try {
                  const withExt = join(resolved, `index.${ext}`)
                  await stat(withExt)
                  // its a match
                  return withExt
                } catch {
                  // keep going
                }
              }
            }
          } catch {
            // not a dir keep going
          }
        },
      } satisfies Plugin,

      {
        name: 'native-special-case-resolver',
        enforce: 'pre',

        /**
         * WORKAROUND: Since currently RN is considered as a "server" environment,
         * and [in such environment](https://github.com/vitejs/vite/blob/v6.0.5/packages/vite/src/node/plugins/resolve.ts#L385-L389), Node.js built-in modules such as `buffer` are [forced to be externalized](https://github.com/vitejs/vite/blob/v6.0.5/packages/vite/src/node/plugins/resolve.ts#L420),
         * even if there are available packages that can be resolved.
         *
         * But we also need RN to be a "server" environment so that other Node.js built-in modules we actually want to ignore [are externalized](https://github.com/vitejs/vite/blob/v6.0.5/packages/vite/src/node/plugins/resolve.ts#L428-L449) but not [polyfilled](https://github.com/vitejs/vite/blob/v6.0.5/packages/vite/src/node/plugins/resolve.ts#L462-L464), since currently we didn't filter out API routes in the RN bundle.
         *
         * Either doing one of the following can make this workaroud go away:
         *
         * 1. Filter out API routes in the RN bundle, so that we don't actually need to worry about Node.js built-ins used in the API routes not being externalized and ignored.
         * 2. Make Vite support a new environment type that is not a "server" nor a "client" (browser).
         */
        async resolveId(id, importer) {
          // Only run this plugin for iOS and Android bundles
          if (this.environment.name !== 'ios' && this.environment.name !== 'android') {
            return
          }

          switch (id) {
            case 'buffer': {
              return findModulePath(join('buffer', 'index.js'), root)
            }
          }
        },
      } satisfies Plugin,

      {
        name: 'one:native-no-external',
        enforce: 'pre',
        config() {
          const noExternalsEnvConfig = {
            consumer: 'server',
            resolve: {
              noExternal: true,
            },
          } as const

          return {
            environments: {
              ios: noExternalsEnvConfig,
              android: noExternalsEnvConfig,
            },
          }
        },
      } satisfies Plugin,

      nodeResolve(),

      swapPrebuiltReactModules(options.cacheDir, {
        // TODO: a better way to pass the mode (dev/prod) to PrebuiltReactModules
        mode: internal.mode || 'dev',
        platform,
      }),

      reactNativeDevAssetPlugin({
        projectRoot: options.root,
        mode: internal.mode,
        assetsDest: internal.assetsDest,
        assetExts: DEFAULT_ASSET_EXTS,
      }),

      getBabelReanimatedPlugin(),

      reactNativeCommonJsPlugin({
        root,
        port,
        mode: 'build',
      }),

      // Avoid "failed to read input source map: failed to parse inline source map url" errors on certain packages, such as react-native-reanimated.
      {
        name: 'remove-inline-source-maps',
        transform: {
          order: 'pre',
          async handler(code, id) {
            if (!id.includes('react-native-reanimated')) {
              return null
            }

            const inlineSourceMapIndex = code.lastIndexOf('//# sourceMappingURL=')
            if (inlineSourceMapIndex >= 0) {
              return code.slice(0, inlineSourceMapIndex).trimEnd()
            }

            return null
          },
        },
      },

      viteNativeSWC({
        tsDecorators: true,
        mode: 'build',
        production: mode === 'prod',
      }),

      // TODO i think this probably should be a swc plugin (has to be wasm-rust unfortuantely)
      // but luckily not too bad because its pretty simple: if export type, export let object
      // and a basic check for if any other export exists that is already there
      {
        name: 'one-node-module-transforms',

        transform: {
          order: 'pre',
          async handler(code: string, id: string) {
            const isNodeModule = id.includes('node_modules')

            // handles typescript
            if (isNodeModule && /\.tsx?$/.test(id)) {
              let codeOut: string | null | undefined
              let sourceMap: any

              // Codegen specification files need to go through the react-native codegen babel plugin.
              // See:
              // * https://reactnative.dev/docs/fabric-native-components-introduction#1-define-specification-for-codegen
              // * https://reactnative.dev/docs/turbo-native-modules-introduction#1-declare-typed-specification
              if (NATIVE_COMPONENT_RE.test(id) || SPEC_FILE_RE.test(id)) {
                reactNativeCodegenDebug?.(
                  `Using babel on file (@react-native/babel-plugin-codegen): ${id}`
                )
                try {
                  const output = await babel.transform(code, {
                    configFile: false,
                    presets: ['@babel/preset-typescript'],
                    plugins: ['@react-native/babel-plugin-codegen'],
                    sourceMaps: true,
                    filename: id,
                  })

                  codeOut = output?.code
                  sourceMap = output?.map

                  if (reactNativeCodegenDebug) {
                    if (codeOut) {
                      reactNativeCodegenDebug(`File transformed with codegen: ${id}`)
                    } else {
                      reactNativeCodegenDebug(`File NOT transformed with codegen: ${id}`)
                    }
                  }
                } catch (e) {
                  console.error(
                    '[react-native-codegen] Failed to transform NativeComponent file:',
                    id,
                    e
                  )
                }
              }

              if (!codeOut) {
                const output = await swcTransform(id, code, {
                  mode: mode === 'dev' ? 'serve' : 'build',
                  noHMR: true, // We should not insert HMR runtime code at this stage, as we expect another plugin (e.g. vite:react-swc) to handle that. Inserting it here may cause error: `The symbol "RefreshRuntime" has already been declared`.
                })

                codeOut = output?.code
                sourceMap = output?.map
              }

              if (!codeOut) return null

              // add back in export types as fake objects:

              // we need to keep fake objects for type exports
              const typeExportsMatch = code.match(/^\s*export\s+type\s+([^\s]+)/gi)
              if (typeExportsMatch) {
                for (const typeExport of Array.from(typeExportsMatch)) {
                  const [_export, _type, name] = typeExport.split(/\s+/)
                  // FIXME: support `export { ... } from '...'`
                  if (name.startsWith('{')) continue

                  // FIXME: support `export type Type<T> = ...`
                  if (name.includes('<')) continue

                  // basic sanity check it isn't exported already
                  const alreadyExported = new RegExp(
                    `export (const|let|class|function) ${name}\\s+`
                  ).test(codeOut)

                  if (!alreadyExported) {
                    const fakeExport = `export let ${name} = {};`
                    codeOut += `\n${fakeExport}\n`
                  }
                }
              }

              return {
                code: codeOut,
                map: sourceMap,
              }
            }

            // handles expo modules
            if (
              isNodeModule &&
              (id.includes('node_modules/expo-') || id.includes('node_modules/@expo/'))
            ) {
              // Use the exposed transform from vite, instead of directly
              // transforming with esbuild
              return transformWithEsbuild(code, id, {
                loader: 'jsx',
                jsx: 'automatic',
              })
            }
          },
        },
      },

      {
        // FIXME: This is a workaround to "tree-shake" things that will cause problems away before we have Rollup tree-shaking configured properly (https://github.com/onejs/one/pull/340).
        name: 'vxrn:manual-tree-shake',
        enforce: 'post',
        async renderChunk(code, chunk, options, meta) {
          if (chunk.name.endsWith('packages/one/dist/esm/createApp.native')) {
            // What we want to do here is to "tree-shake" `require('react-scan/native')` away if it's value is not assigned to anything (i.e. not used).
            // However, `react-scan/native` will be wrapped with a "commonjs-es-import" virtual module by the `@rollup/plugin-commonjs` plugin (Vite built-in) so that import won't have `react-scan/native` in it's name. The only thing for sure is that it's path will contain `_virtual`.
            // As in `createApp.native` the only "side-effect modules" we are currently using are './polyfills-mobile' and './setup', which won't be wrapped with a virtual module, this won't remove unintended things for now.
            return { code: code.replace(/^require\(.+_virtual.+\);/gm, '') }
          }
        },
      } satisfies Plugin,
    ].filter(Boolean),

    appType: 'custom',
    root,
    clearScreen: false,

    optimizeDeps: {
      ...optimizeDeps,
      esbuildOptions: {
        jsx: 'automatic',
      },
    },

    resolve: {
      dedupe,
    },

    mode: mode === 'dev' ? 'development' : 'production',

    define: {
      'process.env.NODE_ENV': mode === 'dev' ? `"development"` : `"production"`,
      'process.env.ONE_SERVER_URL': JSON.stringify(serverUrl),
    },

    build: {
      ssr: true,
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        ignore(id) {
          return id === 'react/jsx-runtime' || id === 'react/jsx-dev-runtime'
        },
      },
      rollupOptions: {
        input: options.entries.native,
        treeshake: false,
        preserveEntrySignatures: 'strict',
        output: {
          preserveModules: true,
          format: 'cjs',
        },

        onwarn(message, warn) {
          // Suppress "Module level directives cause errors when bundled" warnings
          if (!process.env.DEBUG?.startsWith('vxrn')) {
            if (
              message.code === 'MODULE_LEVEL_DIRECTIVE' ||
              message.code === 'INVALID_ANNOTATION' ||
              message.code === 'MISSING_EXPORT' ||
              message.code === 'SOURCEMAP_ERROR'
            ) {
              warnAboutSuppressingLogsOnce()
              return
            }
          }
          warn(message)
        },

        onLog(level, log, handler) {
          if (!process.env.DEBUG?.startsWith('vxrn')) {
            if (IGNORE_ROLLUP_LOGS_RE.test(log.message)) {
              warnAboutSuppressingLogsOnce()
              return
            }
          }

          handler(level, log)
        },
      },
    },
  } satisfies InlineConfig

  // TODO
  // if (options.nativeConfig) {
  //   nativeBuildConfig = mergeConfig(nativeBuildConfig, options.nativeConfig) as any
  // }

  // // this fixes my swap-react-native plugin not being called pre 😳
  resolvedConfig = await resolveConfig(nativeBuildConfig, 'build')

  // The `resolveConfig` function will load user's `vite.config.*` (by calling `loadConfigFromFile`).
  // Here we do this to make user defined global constant replacements (https://vite.dev/config/shared-options#define) to take effect in RN.
  // TODO: Ultimately, we should make all the user defined config options to take effect in RN.
  if (resolvedConfig.define) {
    nativeBuildConfig.define = {
      ...nativeBuildConfig.define,
      ...resolvedConfig.define,
    }
  }

  return nativeBuildConfig satisfies UserConfig
}

let resolvedConfig: ResolvedConfig | null = null
export function getReactNativeResolvedConfig() {
  return resolvedConfig
}

let didWarnSuppressingLogs = false
function warnAboutSuppressingLogsOnce() {
  if (!didWarnSuppressingLogs) {
    didWarnSuppressingLogs = true
    // honestly they are harmdless so no need to warn, but it would be nice to do it once ever and then save that we did to disk
    // console.warn(` [vxrn] Suppressing mostly harmless logs, enable with DEBUG=vxrn`)
  }
}

/**
 * Recursively search for a path in node_modules directories until file system root is reached.
 */
async function findModulePath(
  modulePath: string,
  currentDir: string,
  triedPaths?: Array<string>
): Promise<string | null> {
  const currentModulePath = join(currentDir, 'node_modules', modulePath)

  try {
    await stat(currentModulePath)
    return currentModulePath
  } catch {
    const parentDir = dirname(currentDir)

    if (parentDir === currentDir) {
      throw new Error(`Could not find module in any of these paths: ${triedPaths?.join(', ')}`)
    }

    return findModulePath(modulePath, parentDir, [...(triedPaths || []), currentModulePath])
  }
}
