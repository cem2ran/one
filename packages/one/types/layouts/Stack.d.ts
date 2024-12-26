import type { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { type NativeStackNavigationEventMap, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
export declare const Stack: import("react").ForwardRefExoticComponent<Omit<Omit<import("@react-navigation/native-stack").NativeStackNavigatorProps, "initialRouteName" | "children" | "layout" | "id" | "screenOptions" | "screenListeners" | "screenLayout" | "UNSTABLE_getStateForRouteNamesChange"> & import("@react-navigation/routers").DefaultRouterOptions<string> & {
    children: React.ReactNode;
    layout?: ((props: {
        state: StackNavigationState<ParamListBase>;
        navigation: import("@react-navigation/core").NavigationHelpers<ParamListBase, {}>;
        descriptors: Record<string, import("@react-navigation/core").Descriptor<NativeStackNavigationOptions, import("@react-navigation/core").NavigationProp<ParamListBase, string, string | undefined, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap>, import("@react-navigation/core").RouteProp<ParamListBase, string>>>;
        children: React.ReactNode;
    }) => React.ReactElement) | undefined;
    screenListeners?: Partial<{
        transitionStart: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionStart", unknown>;
        transitionEnd: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionEnd", unknown>;
        gestureCancel: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "gestureCancel", unknown>;
        sheetDetentChange: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "sheetDetentChange", unknown>;
        focus: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "focus", unknown>;
        blur: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "blur", unknown>;
        state: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "state", unknown>;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "beforeRemove", true>;
    }> | ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
    }) => Partial<{
        transitionStart: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionStart", unknown>;
        transitionEnd: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionEnd", unknown>;
        gestureCancel: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "gestureCancel", unknown>;
        sheetDetentChange: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "sheetDetentChange", unknown>;
        focus: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "focus", unknown>;
        blur: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "blur", unknown>;
        state: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "state", unknown>;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "beforeRemove", true>;
    }>) | undefined;
    screenOptions?: NativeStackNavigationOptions | ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
        theme: ReactNavigation.Theme;
    }) => NativeStackNavigationOptions) | undefined;
    screenLayout?: ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
        theme: ReactNavigation.Theme;
        children: React.ReactElement;
    }) => React.ReactElement) | undefined;
    UNSTABLE_getStateForRouteNamesChange?: (state: import("@react-navigation/routers").NavigationState) => import("@react-navigation/routers").PartialState<import("@react-navigation/routers").NavigationState> | undefined;
} & {
    id?: undefined;
}, "children"> & Partial<Pick<Omit<import("@react-navigation/native-stack").NativeStackNavigatorProps, "initialRouteName" | "children" | "layout" | "id" | "screenOptions" | "screenListeners" | "screenLayout" | "UNSTABLE_getStateForRouteNamesChange"> & import("@react-navigation/routers").DefaultRouterOptions<string> & {
    children: React.ReactNode;
    layout?: ((props: {
        state: StackNavigationState<ParamListBase>;
        navigation: import("@react-navigation/core").NavigationHelpers<ParamListBase, {}>;
        descriptors: Record<string, import("@react-navigation/core").Descriptor<NativeStackNavigationOptions, import("@react-navigation/core").NavigationProp<ParamListBase, string, string | undefined, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap>, import("@react-navigation/core").RouteProp<ParamListBase, string>>>;
        children: React.ReactNode;
    }) => React.ReactElement) | undefined;
    screenListeners?: Partial<{
        transitionStart: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionStart", unknown>;
        transitionEnd: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionEnd", unknown>;
        gestureCancel: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "gestureCancel", unknown>;
        sheetDetentChange: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "sheetDetentChange", unknown>;
        focus: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "focus", unknown>;
        blur: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "blur", unknown>;
        state: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "state", unknown>;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "beforeRemove", true>;
    }> | ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
    }) => Partial<{
        transitionStart: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionStart", unknown>;
        transitionEnd: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "transitionEnd", unknown>;
        gestureCancel: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "gestureCancel", unknown>;
        sheetDetentChange: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "sheetDetentChange", unknown>;
        focus: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "focus", unknown>;
        blur: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "blur", unknown>;
        state: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "state", unknown>;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<NativeStackNavigationEventMap & import("@react-navigation/core").EventMapCore<StackNavigationState<ParamListBase>>, "beforeRemove", true>;
    }>) | undefined;
    screenOptions?: NativeStackNavigationOptions | ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
        theme: ReactNavigation.Theme;
    }) => NativeStackNavigationOptions) | undefined;
    screenLayout?: ((props: {
        route: import("@react-navigation/core").RouteProp<ParamListBase, string>;
        navigation: import("@react-navigation/native-stack").NativeStackNavigationProp<ParamListBase, string, undefined>;
        theme: ReactNavigation.Theme;
        children: React.ReactElement;
    }) => React.ReactElement) | undefined;
    UNSTABLE_getStateForRouteNamesChange?: (state: import("@react-navigation/routers").NavigationState) => import("@react-navigation/routers").PartialState<import("@react-navigation/routers").NavigationState> | undefined;
} & {
    id?: undefined;
}, "children">> & import("react").RefAttributes<unknown>> & {
    Screen: (props: import("../useScreens").ScreenProps<NativeStackNavigationOptions, StackNavigationState<ParamListBase>, NativeStackNavigationEventMap>) => null;
};
export default Stack;
//# sourceMappingURL=Stack.d.ts.map