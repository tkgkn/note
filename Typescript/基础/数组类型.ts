const filename = '数组类型'

// 最简单的表示法就是 type[]
let arr: number[] = [1, 2, 3, 4, '4']

// 数组的一些方法也不允许声明类型之外的插入
arr.push(1)
arr.push('box')


// 数组泛型表示数组 Array<elemType>
let arr2 : Array<number> = [1, 2, 3, 4, '6']

// 用接口表示数组
interface theArr {
  [index: number]: number
}

let arr3 : theArr = [1,2,3]

// any在数组中的使用
let arr4: any[] = [1, '2', false, {box: '正方形'}]

// 类数组，一般都有内置的对象，还有如NodeList HTMLCollection
function sum(num1: number, num2 : number) {
  let args : IArguments = arguments
  console.log(args)
  return args[0] + args[1]
}
sum(1, '2') // 不能传字符

export default filename
