'use client'

import { cn } from '@/lib/utils'
import {
  BookCheck,
  Image,
  MessageCircleMore,
  Newspaper,
  Repeat2,
  Search
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Separator } from './ui/separator'

type SectionProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
  separator?: boolean
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  title,
  separator = false
}) => {
  const [language, setLanguage] = useState('zh')
  useEffect(() => {
    setLanguage(navigator.language)
  }, [])

  let icon: React.ReactNode
  switch (title) {
    case 'Images':
      // eslint-disable-next-line jsx-a11y/alt-text
      icon = <Image size={18} className="mr-2" />
      break
    case 'Sources':
      icon = <Newspaper size={18} className="mr-2" />
      break
    case 'Answer':
      icon = <BookCheck size={18} className="mr-2" />
      break
    case 'Related':
      icon = <Repeat2 size={18} className="mr-2" />
      break
    case 'Follow-up':
      icon = <MessageCircleMore size={18} className="mr-2" />
      break
    default:
      icon = <Search size={18} className="mr-2" />
  }
  const title2Chinese: { [key: string]: string } = {
    Images: '图片',
    Sources: '来源',
    Answer: '结论',
    Related: '相关问题',
    'Follow-up': '继续提问'
  }

  return (
    <>
      {separator && <Separator className="my-2 bg-primary/10" />}
      <section
        className={cn(
          ` ${size === 'sm' ? 'py-1' : size === 'lg' ? 'py-4' : 'py-2'}`,
          className
        )}
      >
        {title && (
          <h2 className="flex items-center text-lg leading-none py-2">
            {icon}
            {language.toLocaleLowerCase().indexOf('zh') > -1
              ? title2Chinese[title]
              : title}
          </h2>
        )}
        {children}
      </section>
    </>
  )
}
