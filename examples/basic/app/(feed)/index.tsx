import { Stack, useLoader } from 'vxs'
import { feedData } from '~/features/feed/data'
import { FeedCard } from '~/features/feed/FeedCard'
import { PageContainer } from '~/features/ui/PageContainer'

export function loader() {
  return {
    feed: feedData,
  }
}

export default function FeedPage() {
  const { feed } = useLoader(loader)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <PageContainer>
        {feed.map((item, i) => {
          return <FeedCard key={i} {...item} />
        })}
      </PageContainer>
    </>
  )
}