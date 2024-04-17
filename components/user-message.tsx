import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

type UserMessageProps = {
  message: string
  isFirstMessage?: boolean
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  isFirstMessage
}) => {
  const router = useRouter()

  return (
    <div className={(cn({ 'pt-4': !isFirstMessage }), 'flex gap-2')}>
      <a href="/" className="p-2 cursor-pointer bg-zinc-100 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-undo-2"
        >
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
      </a>
      <div className="text-xl">{message}</div>
    </div>
  )
}
