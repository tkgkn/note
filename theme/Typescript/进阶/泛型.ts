/*
 * @Description:
 * @Author: 小明
 * @Date: 2019-09-02 17:03:22
 * @LastEditors: 小明
 * @LastEditTime: 2019-09-02 20:32:42
 */
function createArr<T>(length: number, value: T): T[] {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArr(3, 'abc')

// 多个参数
function swap<A, B>(tuple: [A, B]): [B, A] {
  return [tuple[1], tuple[0]]
}

swap([1, 2])

// 泛型约束，泛型因为在调用时才决定类型，所以有些属性和方法不一定存在
interface hasLength {
  length: number
}

function getLength<T extends hasLength>(arg: T): T {
  return arg
}

// 多个类型参数之间互相约束
function copyFields<T extends U, U>(target: T, origin: U): T {
  for (let k in origin) {
    target[k] = (<T>origin)[k]
  }
  return target
}
