import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(val: string) {
  if (!val) return ''
  let v = val.replace(/\D/g, '')
  if (v.length <= 10) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return v.substring(0, 15)
}
