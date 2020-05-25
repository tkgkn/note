import React from 'react'

// React.Compnent<P, S> 这里是2个泛型，需要我们为props和state提供对应的类型变量。好处是：通过this.state可以获得代码提示。

// 因为state的类型，需要根据类型变量来初始化state，否则会报错。

// state 和 props 可以用readonly禁止直接改变，但是不是必须的，React.Component<P, S>已经实现immutable了。

class Comp extends React.Component<{message: string}, {count: number}> {
  state = {
    // count: 's' // 报错
    count: 0
  }

  // 这里通过【!:】断言修饰符告诉ts，something一定不是null或undefined。否则，不初始化值会报错。
  // 或者这里使用【?:】，识别为可能是undefined
  something?: string
  // something: string 这里将报错

  increment = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  decrement = () => {
    this.setState({
      count: this.state.count - 1
    })
    this.something = 'smoe'
    console.log(this.something)
  }

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}

export default Comp