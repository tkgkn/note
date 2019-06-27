// 普通类型不允许在赋值中被改变
var str = 'this is string';
str = 8;
// any 类型可以
var any1 = 'seven';
any1 = true;
// any类型的话，可以访问其任何属性和方法，感觉有点像{}
var anything = 'i am string';
console.log(anything.hello);
console.log(anything.method1());

// 未声明类型，则认为是any，等价于声明成any类型
let something
something = '1'
something = 1
something = true