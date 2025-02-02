import { IndentIncrease, MessageCircle } from '@tamagui/lucide-icons'
import {
  Button,
  type ButtonProps,
  Circle,
  ScrollView,
  SizableText,
  TooltipSimple,
  XGroup,
  XStack,
} from 'tamagui'
import { useCurrentChannel, useCurrentChannelThreads } from '~/state/useQuery'
import {
  updateUserCurrentChannel,
  updateUserOpenThread,
  useUserCurrentChannelState,
} from '~/state/user'
import type { ThreadWithRelations } from '~/zero'
import { OneBall } from '../brand/Logo'
import { ButtonSimple } from '../ButtonSimple'
import { ChannelSettingsPopover } from '../channel/ChannelSettingsPopover'
import { mainTopBarHeight } from './constants'
import { useCurrentThreadWithMessages } from '~/state/message/useCurrentThreadWithMessages'

export const MainTopBar = () => {
  const threads = useCurrentChannelThreads()

  return (
    <XStack
      h={mainTopBarHeight}
      pos="absolute"
      t={0}
      l={0}
      r={0}
      bg="$color1"
      elevation={1}
      zi={100_000}
      py="$2"
      px="$2"
    >
      <XStack ai="center" gap="$1">
        <ChannelViewToggle />
      </XStack>

      <ScrollView my="$-2" f={2} horizontal showsHorizontalScrollIndicator={false}>
        <XStack p="$2" ai="center" gap="$1">
          {threads.map((thread) => {
            return <ThreadButton key={thread.id} thread={thread} />
          })}
        </XStack>
      </ScrollView>

      <XStack ai="center">
        <ChannelSettingsPopover />
      </XStack>
    </XStack>
  )
}

const ChannelViewToggle = () => {
  const channelState = useUserCurrentChannelState()
  const channel = useCurrentChannel()
  const view = channelState?.mainView

  const activeStyle: ButtonProps = {
    bg: '$color2',
  }

  const inactiveStyle: ButtonProps = {
    bg: 'transparent',
    size: '$2.5',
    scaleIcon: 1.3,
    borderWidth: 0,
    borderRadius: 0,
  }

  return (
    <XGroup overflow="hidden" borderWidth={1} borderColor="$borderColor">
      <TooltipSimple label="Chat view">
        <Button
          disabled={!channel}
          disabledStyle={{
            o: 0.5,
          }}
          {...inactiveStyle}
          icon={MessageCircle}
          {...(view !== 'thread' && activeStyle)}
          onPress={() => {
            updateUserCurrentChannel({
              mainView: 'chat',
            })
          }}
        />
      </TooltipSimple>
      <TooltipSimple label="Thread view">
        <Button
          {...inactiveStyle}
          disabled={!channel}
          disabledStyle={{
            o: 0.5,
          }}
          icon={IndentIncrease}
          {...(view === 'thread' && activeStyle)}
          onPress={() => {
            updateUserCurrentChannel({
              mainView: 'thread',
            })
          }}
        />
      </TooltipSimple>
    </XGroup>
  )
}

const ThreadButton = ({ thread }: { thread: ThreadWithRelations }) => {
  const currentThread = useCurrentThreadWithMessages()
  const isOpen = currentThread?.id === thread.id

  return (
    <ButtonSimple
      active={isOpen}
      onPress={() => {
        updateUserOpenThread(thread)
      }}
    >
      <SizableText size="$3" maw="100%" ellipse userSelect="none" cur="default" f={1} ov="hidden">
        {thread.messages[0]?.content}
      </SizableText>
    </ButtonSimple>
  )
}
