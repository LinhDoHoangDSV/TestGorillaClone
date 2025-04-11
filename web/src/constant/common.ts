import { JSX } from 'react'

export type RouterType = {
  title: string
  path: string
  element: JSX.Element
  header: boolean | JSX.Element
  footer: boolean | JSX.Element
}
