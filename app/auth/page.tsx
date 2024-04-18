'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import React, { useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'
import { useRouter } from 'next/navigation'

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { selectGlobal, setGlobalState } from '@/lib/store/globalSlice'

export default function Auth() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [remCode, setRemCode] = useState(true)

  const dispatch = useAppDispatch()
  const global = useAppSelector(selectGlobal)

  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get('pwd')
    const urlConfirm = new URLSearchParams(window.location.search).get(
      'confirm'
    )
    const storageCode = getLocalStorage(window, 'code')
    if (urlCode && urlConfirm === 'true') login(urlCode)
    else if (urlCode) setCode(urlCode)
    else if (urlConfirm === 'true') login()
    !urlCode && !urlConfirm && storageCode && setCode(storageCode)
  }, [])

  // 登录
  const login = async (code?: string) => {
    const hostname = window.location.host.split('.')[0]
    const response = await fetch(
      `https://test-api2.proxy302.com/bot/v1/${hostname}${
        code ? '?pwd=' + code : ''
      }`
    )
    // const response = await fetch(
    //   `https://test-api2.proxy302.com/bot/v1/sqdq-morphic${
    //     code ? '?pwd=' + code : ''
    //   }`
    // )
    // const response = await fetch(
    //   `https://dash-api.gpt302.com/bot/v1/jerrymoo-search?pwd=A6fa`
    // )
    if (response.status === 200) {
      const data = JSON.parse(await response.text())
      if (data.code === 0) {
        // 记住分享码
        remCode &&
          code &&
          setLocalStorage(window, {
            code
          })
        // 保存数据
        const {
          api_key,
          created_by,
          current_date_cost,
          limit_daily_cost,
          model_name
        } = data.data
        dispatch(
          setGlobalState({
            api_key,
            created_by,
            current_date_cost,
            limit_daily_cost,
            model_name
          })
        )
        router.push('/')
      } else if (data.code === -101) setErrMessage('调研工具已删除')
      else if (data.code === -100) setErrMessage('调研工具已禁用')
      else if (data.code === -99) setErrMessage('分享码错误')
      else setErrMessage('未知错误')
    } else setErrMessage('网络错误')
  }
  return (
    <div className="share-code-container">
      <img src="/logo-horizontal-dark.png" alt="ai-302" width="100"></img>
      <div className="share-code flex flex-col gap-2">
        <div className="flex justify-center">
          <svg
            className="lock_svg__icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="52"
            height="52"
          >
            <path
              d="M153.6 469.312v469.376h716.8V469.312H153.6zM64 384h896v640H64V384zm403.2 329.92c-26.752-14.72-44.8-42.304-44.8-73.92 0-47.104 40.128-85.312 89.6-85.312 49.472 0 89.6 38.208 89.6 85.312 0 31.616-18.048 59.136-44.8 73.92v115.968a44.8 44.8 0 0 1-89.6 0V713.92zM332.8 384h358.4V256c0-94.272-80.256-170.688-179.2-170.688-98.944 0-179.2 76.416-179.2 170.688v128zM512 0c148.48 0 268.8 114.56 268.8 256v128H243.2V256C243.2 114.56 363.52 0 512 0z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="font-bold text-xl mt-4">需要分享码</div>
        <div className="mb-5">创建者开启了验证, 请在下方填入分享码</div>
        <div className="flex justify-center mb-1">
          <Input
            className="w-3/4 text-center"
            style={{ borderColor: '#f4f4f5', backgroundColor: '#f4f4f5' }}
            placeholder="请输入分享码"
            defaultValue={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
          />
        </div>
        {errMessage && (
          <div style={{ color: 'rgb(212, 14, 14)' }}>
            <span dangerouslySetInnerHTML={{ __html: errMessage }}></span>
            ，更多请访问{' '}
            <a
              className="underline"
              style={{ color: '#0070f0' }}
              href="https://302.ai/"
              target="_blank"
            >
              302.AI
            </a>
          </div>
        )}
        <div className="flex justify-center mt-1">
          <Button className="w-3/4" onClick={() => login(code)}>
            确认
          </Button>
        </div>
        <label
          htmlFor="remember"
          className="flex justify-center items-center gap-2 cursor-pointer"
        >
          <Checkbox
            id="remember"
            onCheckedChange={value => setRemCode(Boolean(value))}
            defaultChecked
          />
          <div>记住分享码</div>
        </label>
      </div>
    </div>
  )
}
