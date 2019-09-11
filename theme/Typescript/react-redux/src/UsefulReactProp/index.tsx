/* ref引用， 联合类型等 */

import React from 'react'

interface IProps extends DefaultProps {
  descText: string
  style?: React.CSSProperties // 可以在调用组件的地方，获得style的完美提示。
  additionDom?: React.ReactNode
  renderReactNode?: () => React.ReactNode
  onChange: React.FormEventHandler<HTMLInputElement> // 推荐这种写法让TS自己推断。也可以像下面这样写。
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  buttonSize: 'small' | 'middle' | 'big'
} 

type DefaultProps = typeof UsefulReactProp.defaultProps

interface IState {
  value: string
}

class UsefulReactProp extends React.Component<IProps, IState>{
  static defaultProps = {
    initVal: '输入内容'
  }

  // 创建一个dom引用
  static aDom = React.createRef<HTMLDivElement>()

  state = {
    value: this.props.initVal
  }

  defaultOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {onChange} = this.props
    this.setState({
      value: e.target.value
    })
    onChange(e)
  }

  render() {
    const { onChange, style, additionDom, renderReactNode } = this.props
    const {value} = this.state
    const btnSize = this.props.buttonSize === 'big' ? '100px' : this.props.buttonSize === 'small' ? '60px' : '80px;'
    return <div>
      <input type="text" value={value} onChange={this.defaultOnChange} />
      <p className="desc" style={style}>这是个带样式的提醒</p>
      <div className="additional">
        {additionDom}
      </div>
      <div className="by-func-rcnode">
        {renderReactNode ? renderReactNode() : null}
      </div>
      <button style={{width: btnSize}}>按钮尺寸：联合类型提示</button>
    </div>
  }
}

export default UsefulReactProp