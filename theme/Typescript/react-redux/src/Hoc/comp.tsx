import React from 'react'
import { InjectedProps } from './index'

type Props = InjectedProps & {
  label: string
}

// 函数式写法
// export const FcCounter: React.FC<Props> = props => {
//   const { label, count, onIncrement } = props
//   const handleIncrement = () => {
//     onIncrement()
//   }
//   return (
//     <div>
//       <span>
//         {label}:{count}
//       </span>
//       <button type="button" onClick={handleIncrement}>{`Increment`}</button>
//     </div>
//   )
// }

// 将注入的props
export class FcCounter extends React.Component<Props, {}> {
  handleIncrement = () => {
    this.props.onIncrement()
  }
  render() {
    const { label, count } = this.props
    return (
      <div>
        <span>
          {label}:{count}
        </span>
        <button
          type="button"
          onClick={this.handleIncrement}
        >{`Increment`}</button>
      </div>
    )
  }
}
