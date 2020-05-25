import React from 'react'
import ThemeContext, { Theme, themes } from './ctx'
import ThemeButton from './themeButton'

interface State {
  theme: Theme
}

export default class ThemeProvider extends React.Component<{}, State> {
  state: State = {
    theme: themes.light
  }

  toggleTheme = () => {
    this.setState(state => ({
      theme: state.theme === themes.light ? themes.dark : themes.light
    }))
  }

  render() {
    const { theme } = this.state
    const { toggleTheme } = this
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ThemeButton />
      </ThemeContext.Provider>
    )
  }
}
