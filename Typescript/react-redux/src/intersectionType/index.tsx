import React from 'react'

type BaseProps = {
  className?: string,
  style?: React.CSSProperties
  name: string // used in both
}
type DogProps = {
 tailsCount: number
}
type HumanProps = {
 handsCount: number
}

export default class IntersectionComp extends React.Component<{dog: BaseProps & DogProps, human: BaseProps & HumanProps}, {}> {
  render() {
    const {dog, human} = this.props
    return <div>
      <p>dog's tailsCount: {dog.tailsCount}</p>
      <p>human's handsCount: {human.handsCount}</p>
    </div>
  }
}