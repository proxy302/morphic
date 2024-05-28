'use client'

import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { MemoizedReactMarkdown } from './ui/markdown'

export function BotMessage({
  content
}: {
  content: string | StreamableValue<string>
}) {
  const [data, error, pending] = useStreamableValue(content)

  // Currently, sometimes error occurs after finishing the stream.
  if (error) return <div>Error</div>

  async function getGptImageUrl(image: string) {
    try {
      const formData = new FormData()
      formData.append('file', '')
      formData.append('prefix', 'search_master_2')
      formData.append('url', image)
      const fetchRes = await fetch(
        'https://dash-api.proxy302.com/gpt/api/upload/gpt/image',
        {
          method: 'post',
          headers: {
            accept: 'application/json'
          },
          body: formData
        }
      )
      const strRes = await fetchRes.text()
      const res = JSON.parse(strRes)
      return res.data.url
    } catch (e) {
      return image
    }
  }

  return (
    <MemoizedReactMarkdown
      className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
      components={{
        a: ({ href, children }) => {
          return (
            <a href={href} target="_blank">
              {children}
            </a>
          )
        }
      }}
    >
      {data}
    </MemoizedReactMarkdown>
  )
}
