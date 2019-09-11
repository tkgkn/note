import React from 'react'

/* 这里可以用interface 继承 type的写法 */
interface IProps extends defaultProps {
  age: number
} 
type defaultProps = typeof DefaultPropsComp.defaultProps


/* 也可以用type写法, IProps获取不到提示 */
// type IProps = {age: number} & typeof DefaultPropsComp.defaultProps

class DefaultPropsComp extends React.Component<IProps> {
  static defaultProps = {
    name: 'jack'
  }

  // 构造函数不是必须的, 可以用来绑定成员函数的this，或初始化一些变量的时候使用
  // constructor(props: IProps) {
  //   super(props)
  //   console.log(this.props.age) // 这里可以获得props的提示
  //   console.log(this.props.name)
  // }

  echoProps = () => {
    // 这里也可以获得提示
    console.log(this.props.name)
    console.log(this.props.age)
  }

  render() {
    return <p>this is how to set default props of class component</p>
  }
}

export default DefaultPropsComp