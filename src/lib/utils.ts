import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function refSrc(folder: string, file: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/refs/${folder}/${file}`
}
