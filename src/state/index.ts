import { BingWebBot } from '@/lib/bots/bing'
import { BingConversationStyle, ChatMessageModel, BotId, ConversationInfoBase } from '@/lib/bots/bing/types'
import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'

import { atomWithHash, atomWithLocation } from 'jotai-location'
import { initialMessages } from '../../tests/fixtures/messages'
import storage from './storage'
import { getCookie } from '@/lib/utils'

export const GreetMessages = [
  `This is your OpenAI Reverse Proxy URL: Settings --> Copy "API" and key: free`,
];

export const PrompsTemplates = [
  {
    label: 'GPT4',
    desc: '',
    content: ``,
  }
]

type Param = { botId: BotId; page: string }
export interface Prompt {
  title: string
  prompt: string
}

export const isImageOnly = getCookie('IMAGE_ONLY') !== '0'
export const bingConversationStyleAtom = atomWithStorage<BingConversationStyle>('bingConversationStyle', BingConversationStyle.Balanced, undefined, { unstable_getOnInit: true })
export const voiceAtom = atomWithStorage<boolean>('enableTTS', false, undefined, { unstable_getOnInit: true })
export const historyAtom = atomWithStorage<boolean>('enableHistory', false, undefined, { unstable_getOnInit: true })
export const gptAtom = atomWithStorage<boolean>('enableGPT4', false, undefined, { unstable_getOnInit: true })
export const unlimitAtom = atomWithStorage<boolean>('enableUnlimitedConversation', true, undefined, { unstable_getOnInit: true })
export const systemPromptsAtom = atomWithStorage<string>('systemPrompts', '', undefined, { unstable_getOnInit: true })
export const localPromptsAtom = atomWithStorage<Prompt[]>('prompts', [], undefined, { unstable_getOnInit: true })

const createBotInstance = () => {
  return new BingWebBot({})
}

export const chatHistoryAtom = atomWithStorage<{
  conversation?: Partial<ConversationInfoBase>;
  messages?: ChatMessageModel[],
}>('chatHistory', {
  conversation: {},
  messages: initialMessages,
}, createJSONStorage(storage))

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      botId: param.botId,
      bot: createBotInstance(),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversation: {} as Partial<ConversationInfoBase>,
    })
  },
  (a, b) => a.botId === b.botId && a.page === b.page,
)

export const hashAtom = atomWithHash('dialog', '')

export const locationAtom = atomWithLocation()

export const voiceListenAtom = atom(false)
