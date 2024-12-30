import { X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, SizableText, XStack } from 'tamagui'
import { useQuery } from '~/zero'
import { Avatar } from '../Avatar'
import { showToast } from '../toast/Toast'
import { messageInputEmitter, messageReplyEmitter } from './emitters'

export const MessageInputReply = () => {
  const [replyId, setReplyId] = useState('')
  const message = useQuery((q) =>
    q.message.where('id', replyId).related('sender', (q) => q.one())
  )[0][0]
  const sender = message?.sender

  messageReplyEmitter.use((value) => {
    switch (value.type) {
      case 'reply': {
        setReplyId(value.messageId)
        messageInputEmitter.emit({ type: 'focus' })
        break
      }
      case 'cancel': {
        setReplyId('')
        break
      }
    }
  })

  if (!message || !sender) {
    return null
  }

  return (
    <XStack bg="$color6" py="$1.5" px="$2" ai="center" gap="$3" br="$3">
      <Button
        onPress={() => {
          messageReplyEmitter.emit({ type: 'cancel' })
        }}
        size="$1"
        circular
        icon={X}
      />

      <SizableText size="$3">Replying to</SizableText>

      <XStack gap="$2">
        <Avatar size={24} image={sender.image} />
        <SizableText size="$3" fow="500">
          {sender.name || sender.username}
        </SizableText>
      </XStack>
    </XStack>
  )
}
