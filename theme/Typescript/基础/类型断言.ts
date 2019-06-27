const filename = '类型断言'

// 断言，理解为，假定一个原本不确定的东西，然后就可以按照假定的东西去进行接下来的操作
function getLength(val: string | number) : number {
  // 这里的写法其实我们人为假定是字符串类型了，但是实际运行时可能传递的参数不是，ts会报错
  if(val.length) {
    return val.length
  } else {
    return val.toString().length
  }
}

// 改用断言
function getLengthCopy(val: string | number) : number{
  if((<string>val).length) {
    return (<string>val).length
  } else {
    return val.toString().length
  }
}

export default filename
