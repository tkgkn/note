import React from 'react'
import ThemeContext from './ctx'

// 函数组件写法

// type props = React.PropsWithChildren<{}>

// export default function ToggleThemeButton(props: props) {
//   const { children, ...rest } = props
//   return (
//     <ThemeContext.Consumer>
//       {({ theme, toggleTheme }) => {
//         return (
//           <button style={theme} onClick={toggleTheme} {...rest}>
//             {children}
//           </button>
//         )
//       }}
//     </ThemeContext.Consumer>
//   )
// }

// 类组件写法
export default class ToggleThemeButton extends React.Component<{}> {
  static contextType = ThemeContext

  // 后面需要通过this.context访问到上下文，所以定义一个类属性
  // 这里使用!明确告诉TS，该参数一定有。
  // 这里不能使用？，因为context是必选项
  context!: React.ContextType<typeof ThemeContext>

  render() {
    // 前面context必须这么写，这里才能获取TS提示
    const { theme, toggleTheme } = this.context
    return (
      <button style={theme} onClick={toggleTheme} {...this.props}>
        button
      </button>
    )
  }
}
