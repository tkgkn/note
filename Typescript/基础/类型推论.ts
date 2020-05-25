const filename = '类型推论'

// 声明时未做类型，但赋值了，会根据赋值类型推论变量类型
let some = 'book'

some = 1 // 这里会认为是string


// 如果仅仅声明，也未赋值，则认为是any类型
let anything
anything = 1
anything = '2'

export default filename