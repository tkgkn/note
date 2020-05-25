import React from 'react'

interface WrapperProps<T> {
  something: T
  renderItem: (item: T) => React.ReactNode
  // children: any // 方法1，显示增加
}

/* children 如果显示使用, props.children 会报错 */
// const Wrapper = <T extends {}>(props: WrapperProps<T>) => {
//   return (
//     <div>
//       {props.renderItem(props.something)}
//       {props.children}
//     </div>
//   )
// }

/* 方法1： 显示增加children类型 */
// const Wrapper = <T extends {}>(props: WrapperProps<T>) => {
//   return (
//     <div>
//       {props.renderItem(props.something)}
//       {props.children}
//     </div>
//   )
// }

/* 方法2：React.PropsWithChildren */
const Wrapper = <T extends {}>(
  props: React.PropsWithChildren<WrapperProps<T>>
) => {
  return (
    <div>
      {props.renderItem(props.something)}
      {props.children}
    </div>
  )
}
export default Wrapper
