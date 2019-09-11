import React from 'react'

// 这里React.FC<T> T需要传递一个类型参数。

// function(props) {} 这里的T就是props需要的类型注释

// 调用SomeFc的组件的地方，会出现props提示，且不允许传入其他未定义的props

const SomeFc: React.FC<{name: string}> = ({name}) => {
  return <div>{name}</div>
}

export default SomeFc