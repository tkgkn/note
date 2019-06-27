const filename = '函数的类型'

export class conf {
  num1: number = 1
  num2: number = 2
}

// 函数声明
function sum(conf: conf): number {
  return conf.num1 + conf.num2
}


// 函数表达式
// 只是对等号右侧的匿名函数进行了类型定义，而不是对sum2进行类型定义
let sum2 = function(num1: number, num2: number): number {
  return num1 + num2
}

// 表达式函数真正的函数定义方式如下2种：
// 对sum2进行类型定义
// 这里的=>并非是es6中的箭头函数含义，而是ts中对函数定义，左侧输入，右侧输出
let sum2copy: (num1: number, num2: number) => number = function(
  num1: number,
  num2: number
): number {
  return num1 + num2
}

// 用interface定义函数
interface sum3copy {
  (num1: number, num2: number): number
}
let sum3: sum3copy
sum3 = function(num1: number, num2: number, num3: number) {
  // sum3的函数定义已经在接口声明的地方确认了，所以额外的num3不符合定义过的函数形状
  return num1 + num2
}

// 可选参数
function buildName(firstName?: string, lastName: string) {
  // 可选参数只能放在必选参数的后面。这个定义就违反了
  return firstName + lastName
}

// 参数默认值，会被ts识别为可选参数，因为有了默认值，你可以选择不传，而且还不受上面的规则影响，必选可以放在可选参数后
// 这里firstName被识别为了可选参数
function buildName2(firstName: string = 'Jack', lastName: string) {
  return firstName + lastName
}

// 剩余参数
function pushSome(array: any[], ...items: any[]) {
  items.forEach(item => {
    array.push(item)
  })
}
pushSome([], [1, 2, 3])

// 重载 面相对象的概念，可以重写
// 一个例子，reverse函数，接受字符串或数字，返回值是将传入值反转
// 利用联合类型可以这么写
function reverse(val: number | string): number | string {
  if (typeof val === 'number') {
    return Number(
      val
        .toString()
        .split('')
        .reverse()
        .join('')
    )
  } else if (typeof val === 'string') {
    return val
      .split('')
      .reverse()
      .join('')
  }
}

// 使用重载的写法，比上面写起来麻烦，但是清晰的一点是：输入字符串，得到字符串，输入number，得到number
function reverse2(val: number): number // 函数定义
function reverse2(val: string): string // 重载
function reverse2(val: number | string): number | string {
  if (typeof val === 'number') {
    return Number(
      val
        .toString()
        .split('')
        .reverse()
        .join('')
    )
  } else if (typeof val === 'string') {
    return val
      .split('')
      .reverse()
      .join('')
  }
}
reverse2('hello')
reverse2(123)

export default sum