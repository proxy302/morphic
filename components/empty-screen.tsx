import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: '斗鱼回应PDD停播超5个月',
    message: '斗鱼回应PDD停播超5个月'
  },
  {
    heading: '深圳卫健委抖音',
    message: '深圳卫健委抖音'
  },
  {
    heading: '淄博烧烤今年还很火，为什么？',
    message: '淄博烧烤今年还很火，为什么？'
  },
  {
    heading: '国旗上带有武器的，有哪些国家',
    message: '国旗上带有武器的，有哪些国家'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
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
