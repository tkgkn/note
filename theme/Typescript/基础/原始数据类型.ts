const filename = '原始数据类型'

let number1: number = 1

let str: string = 'hello world'
let str2: string = `这是${number1}`

let boolean: boolean = true

// 数组
let arr: number[] = [1, 2, 3] // 规定了元素只能是number
let arr2: Array<number> = [1, 2]

// 元组，规定好数量和类型的数组
let arr3: [number, string, boolean] = [1, '2', !!3]

// 枚举
enum Color {Red, Green, Orange}
let col : Color = Color.Green
console.log(col)

// null 和 undefined
let null1 : null = null
let undefined1 : undefined = undefined

let number2 : number = undefined // 这里可以哦！undefined 和 null属于其他原始类型的子类型。

let voidVal : void;
let number3 : number = voidVal // void类型不能赋值给其他原始类型。

export default filename