import React from 'react'
// 一个泛型的通用组件写法

interface Props<T> {
  list: T[]
  renderItem: (item: T) => React.ReactNode
}

/* 普通函数式 */
// function List<T>(props: Props<T>) {
//   const { list, renderItem } = props
//   const [state, setState] = React.useState<T[]>([])
//   return (
//     <>
//       <ul>{list.map(renderItem)}</ul>
//       <button onClick={() => setState(list)}>show list</button>
//       <p>current item is: {JSON.stringify(state, null, 2)}</p>
//     </>
//   )
// }

/* 箭头函数式 */
// 这里只能用T extends {}，单独使用T，会报错
// const List = <T extends {}>(props: Props<T>) => {
//   const { list, renderItem } = props
//   const [state, setState] = React.useState<T[]>([])
//   return (
//     <>
//       <ul>{list.map(renderItem)}</ul>
//       <button onClick={() => setState(list)}>show list</button>
//       <p>current item is: {JSON.stringify(state, null, 2)}</p>
//     </>
//   )
// }

/* 类式 */
interface State<T> {
  showList: T[]
}

class List<T> extends React.Component<Props<T>, State<T>> {
  state = {
    showList: []
  }

  setList = (showList: T[]) => {
    this.setState({
      showList
    })
  }

  render() {
    const { showList } = this.state
    const { renderItem, list } = this.props
    return (
      <>
        <ul>{list.map(renderItem)}</ul>
        <button onClick={() => this.setList(list)}>show list</button>
        <p>current item is: {JSON.stringify(showList, null, 2)}</p>
      </>
    )
  }
}

export default List
