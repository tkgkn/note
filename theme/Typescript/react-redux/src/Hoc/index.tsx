import React from 'react'

export interface InjectedProps {
  count: number
  onIncrement: () => void
}

export const withState = <IProp extends InjectedProps>(
  WrappedComp: React.ComponentType<IProp>
) => {
  // 使用Omit结合keyof，实现排除掉IProp和InjectedProps交集的部分(count, onIncrement)
  type HocProps = Omit<IProp, keyof InjectedProps> & {
    // 这里做Props的扩展
    initialCount?: number
  }

  type HocState = { readonly count: number }

  return class Hoc extends React.Component<HocProps, HocState> {
    // 组件的名字，方便调试
    static displayName = `withState(${WrappedComp.name})`

    state: HocState = {
      count: Number(this.props.initialCount) || 0
    }

    handleInc = () => {
      this.setState({
        count: this.state.count + 1
      })
    }

    render() {
      const { ...restProps } = this.props
      const { count } = this.state
      return (
        <WrappedComp
          count={count}
          onIncrement={this.handleInc}
          // HOC组件，应该透传与HOC无关的Prop给被包裹的组件。这里的写法是因为TS本身的BUG，如果不断言，则类型报错。
          {...(restProps as IProp)}
        ></WrappedComp>
      )
    }
  }
}
