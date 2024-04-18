import {
  StreamableValue,
  createAI,
  createStreamableUI,
  createStreamableValue,
  getMutableAIState
} from 'ai/rsc'
import { ExperimentalMessage } from 'ai'
import { Spinner } from '@/components/ui/spinner'
import { Section } from '@/components/section'
import { FollowupPanel } from '@/components/followup-panel'
import { inquire, researcher, taskManager, querySuggestor } from '@/lib/agents'

async function submit(formData: FormData, skip?: boolean) {
  'use server'

  const chineseStr = /[\u4e00-\u9fff]/
  const query2Chinese = (key: string) => {
    let query = formData.get(key)
    if (query && chineseStr.test(query.toString())) {
      formData.delete(key)
      formData.append(key, query + '，请搜索内容全部用中文')
    }
  }
  query2Chinese('input')
  query2Chinese('related_query')
  query2Chinese('additional_query')

  const api_key = (formData.get('api_key') || '').toString()

  const aiState = getMutableAIState<typeof AI>()
  const uiStream = createStreamableUI()
  const isGenerating = createStreamableValue(true)

  const messages: ExperimentalMessage[] = aiState.get() as any
  // Get the user input from the form data
  const userInput = skip
    ? `{"action": "skip"}`
    : (formData?.get('input') as string)
  const content = skip
    ? userInput
    : formData
    ? JSON.stringify(Object.fromEntries(formData))
    : null
  // Add the user message to the state
  if (content) {
    const message = { role: 'user', content }
    messages.push(message as ExperimentalMessage)
    aiState.update([...(aiState.get() as any), message])
  }

  async function processEvents() {
    uiStream.update(<Spinner />)

    let action: any = { object: { next: 'proceed' } }
    // If the user skips the task, we proceed to the search
    if (!skip) action = (await taskManager(messages, api_key)) ?? action

    if (action.object.next === 'inquire') {
      // Generate inquiry
      const inquiry = await inquire(uiStream, messages, api_key)

      uiStream.done()
      isGenerating.done()
      aiState.done([
        ...aiState.get(),
        { role: 'assistant', content: `inquiry: ${inquiry?.question}` }
      ])
      return
    }

    //  Generate the answer
    let answer = ''
    let errorOccurred = false
    const streamText = createStreamableValue<string>()
    while (answer.length === 0) {
      // Search the web and generate the answer
      const { fullResponse, hasError } = await researcher(
        uiStream,
        streamText,
        messages,
        api_key
      )
      answer = fullResponse
      errorOccurred = hasError
    }
    streamText.done()

    if (!errorOccurred) {
      // Generate related queries
      await querySuggestor(uiStream, messages, api_key)

      // Add follow-up panel
      uiStream.append(
        <Section title="Follow-up">
          <FollowupPanel />
        </Section>
      )
    }

    isGenerating.done(false)
    uiStream.done()
    aiState.done([...aiState.get(), { role: 'assistant', content: answer }])
  }

  processEvents()

  return {
    id: Date.now(),
    isGenerating: isGenerating.value,
    component: uiStream.value
  }
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string
  id?: string
  name?: string
}[] = []

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number
  isGenerating: StreamableValue<boolean>
  component: React.ReactNode
}[] = []

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submit
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
})
