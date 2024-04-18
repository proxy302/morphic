import { cn } from '@/lib/utils'
import React from 'react'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogTitle
} from './ui/dialog'
import { useAppSelector } from '@/lib/store/hooks'
import { selectGlobal } from '@/lib/store/globalSlice'

type UserMessageProps = {
  message: string
  isFirstMessage?: boolean
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  isFirstMessage
}) => {
  const global = useAppSelector(selectGlobal)

  return (
    <div
      className={
        (cn({ 'pt-4': !isFirstMessage }), 'flex justify-between items-center')
      }
    >
      <div className="flex items-center gap-2">
        {isFirstMessage && (
          <a
            href="/"
            className="flex justify-center items-center cursor-pointer bg-zinc-100 rounded-full w-7 h-7"
          >
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
        )}

        <div className="text-xl">{message}</div>
      </div>
      {isFirstMessage && (
        <Dialog>
          <DialogTrigger>
            <svg
              className="cursor-pointer mr-2"
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="question-circle"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
            </svg>
          </DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>关于 AI搜索大师2.0</DialogTitle>
              <p>
                1. 本翻译工具由302.AI用户 <b>{global.created_by}</b>{' '}
                创建,302.AI是一个AI生成和分享的平台，可以一键生成自己的AI工具
              </p>
              <p>
                2. 此调研工具使用的模型是 <b>gpt-4-turbo</b>
              </p>
              <p>
                3. 此调研工具单日限额 <b>{global.limit_daily_cost}</b>{' '}
                PTC，已使用 <b>{global.current_date_cost}</b> PTC
              </p>
              <p>
                4.
                本工具的查询记录均保存在本机，不会被上传，生成此工具的用户无法看到你的查询记录
              </p>
              <p>
                5. 更多信息请访问：
                <a
                  target="_blank"
                  href="https://302.ai/"
                  className="underline"
                  style={{ color: 'rgb(0, 112, 240)' }}
                >
                  302.AI
                </a>
              </p>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  )
}
