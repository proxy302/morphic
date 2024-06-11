import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { selectGlobal, setGlobalState } from '@/lib/store/globalSlice'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const global = useAppSelector(selectGlobal)
  const dispatch = useAppDispatch()
  const [exampleMessages, setExampleMessages] = useState<
    {
      heading: string
      message: string
    }[]
  >(global.realtimehot)

  const getRealtimeHot = async () => {
    const language = window.navigator.language
    const res = await fetch(
      'https://abcd-research.havethefeb.autos/realtimehot',
      {
        method: 'get'
      }
    )
    const data = JSON.parse(await res.text()).realtimehot as {
      url: string
      title: string
      translate_title?: string
    }[]
    const filterData = data
      .filter(data => data.url.indexOf('weibo?q=') > -1)
      .slice(0, 4)
      .map(data => ({
        heading:
          language.indexOf('zh') > -1
            ? data.title
            : data.translate_title
            ? data.translate_title
            : data.title,
        message: data.title
      }))
    dispatch(setGlobalState({ realtimehot: filterData }))
    setExampleMessages(filterData)
  }

  useEffect(() => {
    if (!exampleMessages.length) getRealtimeHot()
  }, [])

  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="p-2 bg-transparent">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
