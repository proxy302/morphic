import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const morphic_data = 'morphic_data'

export function setLocalStorage(
  window: Window,
  objects: {
    [key: string]: string | number
  }
) {
  if (window) {
    let existedData = JSON.parse(
      window.localStorage.getItem(morphic_data) || '{}'
    )
    existedData = {
      ...existedData,
      ...objects
    }
    window.localStorage.setItem(morphic_data, JSON.stringify(existedData))
  }
}

export function getLocalStorage(window: Window, key: string) {
  if (window) {
    const data = JSON.parse(window.localStorage.getItem(morphic_data) || '{}')
    return data[key]
  }
  return null
}
