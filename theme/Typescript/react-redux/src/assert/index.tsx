import React from 'react'

type UserA = {
  name: string,
  age: number
}

type UserB = {
  name: string,
  sex: string
}

type IProps = {
  user: UserA | UserB
}


class AssertComp extends React.Component<IProps, {}> {
  render() {
    // 这里如果不做类型断言，会提示UserA上没有sex属性
    // const user = this.props.user

    // 因此这里需要断言
    // React中类型断言只能用as，不能用<>语法，跟jsx冲突，会当成标签
    const userB = this.props.user as UserB
    const userA = this.props.user as UserA
    return <div>
      <p>this is a user: {userA.age}</p>
      <p>this is a user: {userB.sex}</p>
    </div>
  }
}
export default AssertComp