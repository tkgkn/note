# Iterator 遍历器

## 概念

ES6 增加了 2 个新的数据结构，`Map`和`Set`，加上`Array`和`Object`，一共有 4 种。为了给四种数据结构提供一种统一的接口机制，因此有了`Iterator`接口。
作用如下：

1.  统一的数据结构接口，具备`Iterator`接口就可以遍历。
2.  使得数据结构的成员按照某种次序排列。
3.  该机制供 ES6 的新命令`for of`循环使用。

*Iterator*的遍历过程：

1.  创建一个指针对象，指向当前数据结构的起始位置。遍历器对象本质就是这么个指针对象。
2.  第一次调用指针对象的`next`方法，将指针对象指向数据结构的第一个成员。
3.  第二次调用指针对象的`next`方法，指针指向第二个成员。
4.  不断调用`next`，直到指向数据结构的结束为止。

每次调用`next`方法，都会返回当前成员的信息，即包含`value`和`done`两个属性的对象。其中`done`代表的是遍历是否结束，一个布尔值。

```js
// 伪代码，描述next返回值
var it = makeIterator(['a', 'b'])
it.next() // {value: 'a', done: false}
it.next() // {value: 'b', done: false}
it.next() // {value: undefined, done: true}

function makeIterator(array) {
  var nextIndex = 0
  return {
    next() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true }
    }
  }
}
```

## 默认 Iterator 接口

ES6 规定，默认的`Iterator`接口部署在数据结构的`Symbol.iterator`属性，属性本身是一个函数，就是默认的遍历器生成函数，执行该函数，就返回一个遍历器。而`Symbol.iterator`本身是一个表达式属性（名）而已。

```js
let obj = {
  [Symbol.iterator]: function() {
    // 本身是个遍历器生成函数，返回得到遍历器
    return {
      next() {
        return {
          value: 1,
          done: true
        }
      }
    }
  }
}
```

ES6 中有些数据结构具备原生的`Iterator`接口，不用任何处理，就可被`for of`循环遍历。如下数据结构：
`Array`，`Map`，`Set`，`String`，`TypedArray`，`函数的arguments对象`，`NodeList对象`

```js
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]() // 获取到遍历器
iter.next() // {value: 'a', done: false}
iter.next() // {value: 'b', done: false}
iter.next() // {value: 'c', done: false}
iter.next() // {value: undefined, done: true}
```

_注意_，`Object`并没有布置默认`Iterator`接口，因为对象的遍历顺序是不确定的，需要开发者手动指定。而遍历器是一种线性处理，而对于对象，部署遍历器接口，相当于部署一种线性转换。不过 ES6 中类似对象的`Map`结构完全可以替代`Object`，无需自己布置。
如果需要让对象支持`for...of`，则需要布置`Iterator`接口。

```js
let obj = {
  value: 0,
  end: 3,
  [Symbol.iterator]: function() {
    var self = this
    return {
      next() {
        var val = self.value
        if (val < self.end) {
          self.value++
          return {
            value: val,
            done: false
          }
        } else {
          return {
            value: undefined,
            done: true
          }
        }
      }
    }
  }
}

var iterator = obj[Symbol.iterator]()
console.log(iterator.next()) // {value: 0, done: false}
console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next()) // {value: 2, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

_注意_：如果`[Symbol.iteratro]`方法对应的不是返回遍历器的函数，则会报错

```js
  var obj = {}
  obj[Symbol.iterator] = () => 1
  [...obj] //  TypeError: [] is not a function  我这里报错的是：Unexpected token
```

## 调用 Iterator 接口的场景

除了`for...of`循环会调用之外。
比如：_解构赋值_

```js
let set = new Set()
  .add('a')
  .add('b')
  .add('c')
let [x, y] = set // x = 'a'  y = 'b'
let [first, ...rest] = set // first = 'a'  rest = ['b', 'c']
```

比如：_扩展运算符_

```js
var str = 'hello'
;[...str] // ['h', 'e', 'l', 'l', 'o']
```

可以利用扩展运算符将任何布置了`iterator`接口的数据结构转为数组。

比如：_yield\*_

```js
let generator = function*() {
  yield 1
  yield* [2, 3, 4]
  yield 5
}
let iterator = generator()
iterator.next() // {value: 1, done: false}
iterator.next() // {value: 2, done: false}
iterator.next() // {value: 3, done: false}
iterator.next() // {value: 4, done: false}
iterator.next() // {value: 5, done: false}
iterator.next() // {value: undefined, done: false}
```

## 字符串 Iterator 接口

字符串也是一个类似数组的对象，有`length`属性，可以以数组下标来访问对应的字符。

```js
var str = 'hi'
var iterator = str[Symbol.iterator]()
iterator.next() // {value: 'h', done: false}
iterator.next() // {value: 'i', done: false}
iterator.next() // {value: undefined, done: false}
```

## Iterator 接口和 Generator 函数

使用`Generator`函数来实现`Symbol.iterator`方法最简单。

```js
  let myIterable = {
    [Symbol.iterator]: function* () {
      yield 1;
      yield 2;
      yield 3;
    }
  }
  [...myIterable] // [1, 2, 3]
```

```js
let obj = {
  *[Symbol.itertor]() {
    yield 'hello'
    yield 'world'
  }
}
for (let item of obj) {
  console.log(item)
}
```

## 关于对象和 Iterator

首先，对象不可以使用`for...of`，除非布置了`Iterator`接口。通常只能使用`for...in`来循环，但只能遍历键名。

如果要使用`for of`来遍历对象，变通方法：
方法 1： 遍历`Object.kesy(obj)`生成的数组
方法 2： 利用`Generator`函数将对象包装一下。

```js
let obj = {
  name: 'jack',
  age: 18
}

// 这步生成一个Generate函数
function* generate(obj) {
  for (let k in obj) {
    yield [k, obj[k]]
  }
}

for (let [k, v] of generate(obj)) {
  console.log(k, v)
}
```
