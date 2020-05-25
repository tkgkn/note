const filename = '联合类型'

// 相当于平时声明赋值时采用的 ||

let anyone : string | number = '1'
anyone = 1
anyone = true

let anyone2 : string | number | boolean = '2'
anyone2 = 2
anyone2 = false

// 只能访问联合类型中，类型共有的属性或放发
function getLength(something: string | number) : number {
  return something.length // 这里会报 number不存在长度属性
}

// 但可以访问共用的
function getString(something: string | number) {
  return something.toString()
}

// 不确定的值，一旦赋值后，就会被推论出一个类型
let anything3 : string | number;
anything3 = 'box'
anything3.length // 没问题

anything3 = 1
anything3.length // 推论为number类型，不具备length

export default filename