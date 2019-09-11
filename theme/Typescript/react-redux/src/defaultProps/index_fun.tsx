import React from 'react'

const defaultProps = {
  work: 'doctor'
}

/* 使用interface组合type声明 */
interface IProps extends defaultPropsType {
  age: number
}
type defaultPropsType = typeof defaultProps

/* 使用type声明 */
// type IProps = {age: number} & typeof defaultProps

function DefaultPropsFC (props: IProps) {
  // 这里可以获得提示
  const {work, age} = props

  return <p>{`The ${work} is ${age}`}</p>
}

// 这里一定要挂载默认属性，不然在使用该组件的地方，还会让你传入默认值
DefaultPropsFC.defaultProps = defaultProps

export default DefaultPropsFC