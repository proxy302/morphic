'use client'

import { ChatPanel } from './chat-panel'
import { ChatMessages } from './chat-messages'
import { useState } from 'react'

export function Chat() {
  const [answering, setAnswering] = useState(false)
  const handleSetAnswering = (flag: boolean) => {
    setAnswering(flag)
  }

  return (
    <div
      className={
        'px-4 md:px-12 pt-4 md:pt-8 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4 overflow-auto ' +
        (answering
          ? ' fixed top-0 bottom-0 left-0 right-0 lg:left-1/4 lg:right-1/4  bg-white desktop-boxShadow'
          : '')
      }
    >
      <ChatMessages />
      <ChatPanel handleSetAnswering={handleSetAnswering} />
    </div>
  )
}
