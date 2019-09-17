import React from 'react'

// react-redux-typescript github

export interface InjectedProps {
  count: number
  onIncrement: () => void
}

export const withState = <IProp extends InjectedProps>(
  _BaseComp: React.ComponentType<IProp>
) => {
  // 获取注入Props后的组件
  const BaseComp = _BaseComp as React.ComponentType<InjectedProps>

  // 排除固定注入的props后的hocprops。
  type HocProps = Omit<IProp, keyof InjectedProps> & {
    // 这里做Props的扩展
    initialCount?: number
    style?: React.CSSProperties
  }

  type HocState = { readonly count: number }

  return class Hoc extends React.Component<HocProps, HocState> {
    // 组件的名字，方便调试
    static displayName = `withState(${BaseComp.name})`
    // 引用包装的原始组件
    static readonly WrappedComp = BaseComp

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
        <Hoc.WrappedComp
          count={count}
          onIncrement={this.handleInc}
          {...restProps}
        ></Hoc.WrappedComp>
      )
    }
  }
}
