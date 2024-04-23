'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/app/action'
import { UserMessage } from './user-message'
import { ArrowRight } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hooks'
import { selectGlobal } from '@/lib/store/globalSlice'
import { getLocalStorage } from '@/lib/utils'

export function FollowupPanel() {
  const [input, setInput] = useState('')
  const { submit } = useActions<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const [language, setLanguage] = useState('zh')
  const global = useAppSelector(selectGlobal)

  useEffect(() => {
    setLanguage(navigator.language)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} isFirstMessage={false} />
    }

    formData.append(
      'api_key',
      global.api_key || getLocalStorage(window, 'api_key')
    )
    formData.append(
      'model_name',
      global.model_name || getLocalStorage(window, 'model_name')
    )
    const responseMessage = await submit(formData)
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])

    setInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-1"
    >
      <Input
        type="text"
        name="input"
        placeholder={
          language.toLocaleLowerCase().indexOf('zh') > -1
            ? '随意向AI提问...'
            : 'Ask a Follow-up question'
        }
        value={input}
        className="pr-14 h-12"
        onChange={e => setInput(e.target.value)}
      />
      <Button
        type="submit"
        size={'icon'}
        disabled={input.length === 0}
        variant={'ghost'}
        className="absolute right-1"
      >
        <ArrowRight size={20} />
      </Button>
    </form>
  )
}
