import React from 'react'

export type Theme = React.CSSProperties

type Themes = {
  dark: Theme
  light: Theme
}

export const themes: Themes = {
  dark: {
    color: 'black',
    backgroundColor: 'white'
  },
  light: {
    color: 'white',
    backgroundColor: 'black'
  }
}
// 这里定义Context的签名
export type ThemeContextProps = { theme: Theme; toggleTheme?: () => void }

// createContext<T>需要一个类型。
const ThemeContext = React.createContext<ThemeContextProps>({
  theme: themes.light
})

export default ThemeContext
