const filename = '任意值'

// 普通类型不允许在赋值中被改变
let str : string = 'this is string'
str = 8

// any 类型可以
let any1 : any = 'seven'
any1 = true

// any类型的话，可以访问其任何属性和方法，感觉有点像{}
let anything : any = 'i am string'
console.log(anything.hello)
console.log(anything.method1())

export default filename