# 对象扩展

ES6 对象扩展的内容

## 属性简洁表示

```js
  // 简写属性
  let name = 'hello'
  const obj = {
    name
  }
  // 相当于
  const obj = {
    name: name
  }

  // 简写方法
  const fn = {
    method() {
      return 'method'
    }
  }
  // 相当于
  const fn = {
    method: function(){
      return 'method
    }
  }
```

属性的存取器属性`setter`和`getter`实际上也是采用了简写方式.

```js
const cart = {
  _wheels: 4,
  get wheels() {
    return this._wheels
  },
  set wheels(val) {
    this._wheels = val
  }
}
```

## 属性名表达式

```js
// 用作属性
let foo = 'name'
let obj = {
  name: 'jack'
}
console.log(obj[foo]) // jack
```

```js
// 用作函数名
let baz = 'test'
let obj = {
  test() {
    console.log('test')
  }
}
obj[baz]()
```

## Object.is 方法

判断 2 个值是否相等，如果是引用类型，比较指针。

```js
Object.is('foo', 'foo') // true

Object.is({}, {}) // false

Object.is(+0, -0) // false

Object.is(NaN, NaN) // true
```

## Object.assign 方法

`Object.assign(target, ...sources)`，同名属性合并，后者覆盖前者。

```js
let a = { a: 1 }
let b = { b: 2 }
let c = { a: 2, b: 3, c: 4 }
Object.assign(a, b, c) // {a: 2, b: 3, c: 4}
```

_注意_，这里是浅复制，如果某个属性的值是对象，则拷贝的是引用。
_注意_，只拷贝源对象自身属性，只拷贝可枚举的属性
_注意_，无法处理 set 和 get.（使用`getOwnPropertyDescriptors`配合`defineProperties`，可以实现正确复制 get,set）

```js
// 同名属性替换需注意的
// 会直接替换掉同名的引用属性，而不是添加，记得上面所说的浅复制
let a = { a: { b: 'c', d: 'e' } }
let b = { a: { b: 'hello' } }
Object.assign(a, b) // {a: {b: 'hello'}}
```

```js
// 处理数组
Object.assign([1, 2, 3], [4, 5])
// 当成对象处理
// 相当于
Object.assign(
  {
    0: 1,
    1: 2,
    2: 3
  },
  {
    0: 4,
    1: 5
  }
) // [4,5,3]
```

## 属性的可枚举性和遍历

**关于枚举遍历的顺序（补）**：ES5 中并没有规定，而是交由浏览器厂商自己实现。而 ES6 中，规定了枚举的顺序。

1.  数字类型，按照升序
2.  字符串类型，按照被添加到对象的先后顺序
3.  符号类型也按照添加顺序

```js
var obj = {
  a: 1,
  0: 1,
  c: 1,
  2: 1,
  b: 1,
  1: 1
}
obj.d = 1
console.log(Object.getOwnPropertyNames(obj).join('')) // 012acbd
```

**忽视可枚举性（enumerable 为 false）的几个操作**：`for..in`, `Object.keys()`, `JSON.stringify()`, `Object.assign()`

**遍历属性的 5 种方法**
`for...in`：循环遍历对象自身和继承的可枚举属性，不含 Symbol 属性
`Object.keys(obj)`： 返回一个数组，包含自身的可枚举属性（不含 Symbol 属性）的键名
`getOwnPropertyNames(obj)`：返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但包含不可枚举）的键名
`Object.getOwnPropertySymbols(obj)`：返回一个数组，包含自身的所有 Symbol 属性的键名
`Reflect.ownKeys(obj)`：返回一个数组，包含对象自身的所有键名，包含 Symbol 和不可枚举属性

## Object.getOwnPropertyDescriptors()

ES2017 中新增的方法，多一个 s，返回一个对象，对象包含了该对象中所有属性描述符。

```js
const obj = {
  foo: 123,
  get bar() {
    return 'abc'
  }
}
Object.getOwnPropertyDescriptors(obj)
```

## 操作原型对象**proto**

`__proto__`只是浏览器普遍支持的一个私有属性，只部署在浏览器环境中。非标准，因此 ES6 为操作原型提供了如下方法
`Object.getPrototypeOf(obj)`：获取原型对象
`Object.setPrototypeOf(obj, prototype)`：设置某个对象的原型

## super 关键字

`this`大家都知道用来指向函数所被调用时的对象。`super`则用来指向当前对象的原型对象

```js
const proto = {
  foo: 'hello'
}

const obj = {
  foo: 'world',
  find() {
    return super.foo
  }
}

Object.setPrototypeOf(obj, proto)
obj.find() // hello 因为这里的super指代obj的原型，而在上一步骤，我们设置了其原型对象未proto
```
_注意_，只能在对象属性简写的方式下使用`super`，如下声明一个具名方法find的方式，则会报错
```js
const proto = {
  foo: 'hello'
}

const obj = {
  foo: 'world',
  find: function() {
    return super.foo
  }
}

Object.setPrototypeOf(obj, proto)
obj.find() // 'super' outside of function or class
```
_注意_：`super`的一个使用场景：
在多级继承时，`super`引用非常有用。如下情况，如果利用`Object.getPropertyOf()`则会出问题：
```js
  let person = {
    getGreeting() {
      return 'Hello'
    }
  }
  let friend = {
    getGreeting() {
      return Object.getPropertyOf(this).getGreeting.call(this) + ', hi'
    }
  }
  Object.setPropertyOf(friend, person);

  let relative = Object.create(friend)
  console.log(person.getGreeting()); // Hello
  console.log(friend.getGreeting()); // Hello, hi
  console.log(relative.getGreeting()); // 报错了
```
_报错原因_：`relative.getGreeting()`这句话，`this`指向就是`relative`，所以调用函数`getGreeting()`后，`Object.getPropertyOf(this)`返回的原型对象就是`friend`，然后`friend.getGreeting.call(this)`，这句话，后面的`this`依旧还是刚才的`relative`，所以相当于再次调用`getGreeting`方法，且`this`绑定到`relative`上，等于重复递归调用，栈溢出，报错！
_解决办法_：
```js
  let friend = {
    getGreeting() {
      return super.getGreeting() + ', hi'
    }
  }
```

## 方法内部属性[[HomeObject]]
ES6中，规范了对象的方法，方法拥有一个内部属性`[[HomeObject]]`，指向该方法所属的对象

## 对象的遍历 keys,values,entries

`Object.keys(obj)`：返回数组，包含可遍历的自身属性的键
`Object.values(obj)`: 返回数组，包含可遍历的自身属性的值
`Object.entries(obj)`：返回数组，包含可遍历的自身属性的键值对数组 [[key: val], [key: val]]

## ES2018 增加了对象的扩展运算符...

*注意*解构的必须是最后一个参数，否则会报错

```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
console.log(z) // {a: 3, b: 4}
```

可以利用`...`实现对象的拷贝，类似`Object.assign()`

```js
let z = { a: 3, b: 4 }
let n = { ...z }
console.log(n) // {a: 3, b: 4}
```

具体详细的看下阮一峰著《ES6 入门》。
