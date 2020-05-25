const filename = '对象的类型'

// TS中，用interface来定义对象的类型
interface Person {
  name: string,
  age: number
}

let tom: Person = {
  name: 'tom',
  age: 25
}

// 不能缺少接口定义的属性
let tom2: Person = { // 提示age is required，但是缺失了
  name: 'tom'
}

// 也不能多
let tom3: Person = {
  name: 'tom3',
  sex: 'boy'
}

// 但是对象的配置有时候会可选，就需要用到? 感觉有点像正则中的?，要么0个要么1个
interface Dog {
  name: string,
  sex?: string
}

let dog: Dog = {
  name: '旺财',
  sex: 'boy'
}

let dog2: Dog = {
  name: '走运'
}

// 动态添加对象的属性，可以使用类似 es6的 属性变量
interface Car {
  price: number,
  [propName: string]: any;
}

let car: Car = {
  price: 10000,
  color: 'blue'
}

let car2: Car = {
  price: 20000,
  type: '货车',
  color: 'red'
}

// 当然可配置的对象属性，我们可以定义它的类型，防止无效扩展
// 任艺属性值类型应该是string，但是size定义了number类型，这里类型定义就报错。
interface Box {
  shape: string,
  size?: number,
  [propName: string]: string
}

let box: Box = { // 因为类型接口本身定义就出问题了，这里跟Box类型不吻合。
  shape: '正方形',
  size: 1,
  use: 'yes' // 不能将number类型赋给string
}

// 只读属性
interface Cat {
  name: string,
  readonly sex: string
}

let cat: Cat = {
  name: 'kitty',
  sex: 'girl' // 这里是初始，第一次赋值的时候，不会报错的
}

cat.sex = 'boy' // 不能改只读属性

export default filename
