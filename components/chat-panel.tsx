import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import type { AI } from '@/app/action'
import { useUIState, useActions, useAIState } from 'ai/rsc'
import { cn, getLocalStorage, setLocalStorage } from '@/lib/utils'
import { UserMessage } from './user-message'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ArrowRight, Plus, Square } from 'lucide-react'
import { EmptyScreen } from './empty-screen'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { selectGlobal, setGlobalState } from '@/lib/store/globalSlice'
import { useRouter } from 'next/navigation'

export function ChatPanel({
  handleSetAnswering
}: {
  handleSetAnswering: (flag: boolean) => void
}) {
  const router = useRouter()
  const global = useAppSelector(selectGlobal)
  const dispatch = useAppDispatch()
  const [language, setLanguage] = useState('zh')
  // api_key
  useEffect(() => {
    setLanguage(navigator.language)
    if (!global.api_key) {
      const urlCode = new URLSearchParams(window.location.search).get('pwd')
      const storageCode = getLocalStorage(window, 'code')
      if (urlCode) login(urlCode)
      else login(undefined, storageCode)
    }
  }, [])

  async function login(code?: string, twiceCode?: string) {
    const hostname = window.location.host.split('.')[0]
    const fetchUrl = `https://test-api2.gpt302.com/bot/v1/${hostname}`
    // const fetchUrl = `https://test-api2.gpt302.com/bot/v1/gpck-morphic`
    const response = await fetch(`${fetchUrl}${code ? '?pwd=' + code : ''}`)
    if (response.status === 200) {
      const data = JSON.parse(await response.text())
      if (data.code === 0) {
        code &&
          setLocalStorage(window, {
            code
          })
        setLocalStorage(window, {
          api_key: data.data.api_key,
          model_name: data.data.model_name
        })
        saveGlobal({
          ...data.data,
          code
        })
        router.push('/')
      } else {
        if (twiceCode) {
          const response = await fetch(`${fetchUrl}?pwd=${twiceCode}`)
          if (response.status === 200) {
            const data = JSON.parse(await response.text())
            if (data.code === 0) {
              saveGlobal({
                ...data.data,
                code: twiceCode
              })
              setLocalStorage(window, {
                api_key: data.data.api_key,
                model_name: data.data.model_name
              })
              router.push('/')
            } else router.push('/auth')
          } else router.push('/auth')
        } else router.push('/auth')
      }
    } else router.push('/auth')
  }

  function saveGlobal(data: { api_key: string; info: string }) {
    // 保存数据
    dispatch(setGlobalState(data))
  }

  const [input, setInput] = useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const [aiMessages, setAiMessages] = useAIState<typeof AI>()
  const { submit } = useActions<typeof AI>()
  const [isButtonPressed, setIsButtonPressed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showEmptyScreen, setShowEmptyScreen] = useState(true)
  // Focus on input when button is pressed
  useEffect(() => {
    if (isButtonPressed) {
      inputRef.current?.focus()
      setIsButtonPressed(false)
    }
  }, [isButtonPressed])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Clear messages if button is pressed
    if (isButtonPressed) {
      handleClear()
      setIsButtonPressed(false)
    }

    // Add user message to UI state
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        isGenerating: false,
        component: (
          <UserMessage
            message={input}
            isFirstMessage={true}
            handleClear={handleClear}
          />
        )
      }
    ])

    // Submit and get response message
    const formData = new FormData(e.currentTarget)
    formData.append(
      'api_key',
      global.api_key || getLocalStorage(window, 'api_key')
    )
    formData.append(
      'model_name',
      global.model_name || getLocalStorage(window, 'model_name')
    )
    const responseMessage = await submit(formData)
    setMessages(currentMessages => [...currentMessages, responseMessage as any])

    setInput('')
  }

  // Clear messages
  const handleClear = () => {
    setIsButtonPressed(true)
    setMessages([])
    setAiMessages([])
  }

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    handleSetAnswering(Boolean(messages.length))
  }, [messages])

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0 && !isButtonPressed) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto">
        <Button
          type="button"
          variant={'secondary'}
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105"
          onClick={() => handleClear()}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            {language.toLocaleLowerCase().indexOf('zh') > -1
              ? '再提问一个'
              : 'New'}
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all" />
        </Button>
      </div>
    )
  }

  // Condition 1 and 3: If there are no messages or the button is pressed, display the form
  const formPositionClass =
    messages.length === 0
      ? 'fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center'
      : 'fixed bottom-8-ml-6'
  return (
    <div className={formPositionClass} style={{ top: '0' }}>
      <div className="flex items-center gap-2 mb-7">
        <img src="/logo.png" alt="ai-302" width={40} />
        <div className="font-medium text-2xl md:text-3xl">AI搜索大师2.0</div>
      </div>
      {/* <IconKuroko className="w-6 h-6 mb-4" /> */}
      <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
        <div className="relative flex items-center w-full">
          <Input
            ref={inputRef}
            type="text"
            name="input"
            placeholder={
              language.toLocaleLowerCase().indexOf('zh') > -1
                ? '随意向AI提问...'
                : 'Ask a question'
            }
            value={input}
            className="pl-4 pr-10 h-12 rounded-full bg-muted"
            onChange={e => {
              setInput(e.target.value)
            }}
          />
          <Button
            type="submit"
            size={'icon'}
            variant={'ghost'}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={input.length === 0}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={message => {
            setInput(message)
          }}
          className={cn(showEmptyScreen ? 'visible' : 'invisible')}
        />
      </form>
      <a
        className="flex items-center gap-1"
        target="_blank"
        href="https://302.ai/"
      >
        <span className="text-xs">Powered By</span>
        <img
          className="object-contain"
          src="/logo-horizontal-dark.png"
          alt="ai-302"
          width={60}
        />
      </a>
    </div>
  )
}
