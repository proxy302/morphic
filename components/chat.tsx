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
        'px-8 md:px-12 pt-6 md:pt-8 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4 overflow-auto' +
        (answering ? ' fixed top-0 bottom-0 left-1/4 right-1/4 bg-white' : '')
      }
      style={{
        boxShadow: answering ? 'rgba(212, 212, 216, 0.2) 0px 0px 0px 8px' : ''
      }}
    >
      <ChatMessages />
      <ChatPanel handleSetAnswering={handleSetAnswering} />
    </div>
  )
}
