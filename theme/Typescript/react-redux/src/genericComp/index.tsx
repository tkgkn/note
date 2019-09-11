import React from 'react'
// 一个泛型的通用组件写法

interface Props<T> {
  list: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>(props: Props<T>) {
  const {list, renderItem} = props
  const [item, setItem] = React.useState<T>()
  return (
    <>
    <ul>
      {list.map(renderItem)}
    </ul>
    
    </>
  )
}