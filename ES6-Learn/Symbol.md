# Symbol
基本概念，属于JS基本类型之一，具有唯一性

## Symbol声明

```js
  // 声明一个Symbol值，使用Symbol函数，不能new，因为是基本类型。
  let name = Symbol()
  console.log(name) // Symbol()

  // 唯一性
  let name2 = Symbol()
  name === name2 // false
  name == name2 // false

  // 描述符，区分Symbol，描述符可相同，不影响Symbol的唯一性
  let jack = Symbol('jack')
  console.log(jack) // Symbol(jack)
```

## Symbol的唯一性
Symbol的唯一性，使得它可作为对象的键名，防止对象名被覆盖。如下：
```js
  let name = Symbol('name')
  let obj = {
    [name]: 'the name', // Symbol作为属性名，必须加[]
    name: 'jack' // 这个name是一个字符串
  }
  console.log(obj.name) // jack .修饰符的访问，后面均为字符串
  console.log(obj[name]) // the name 通过[]访问Symbol
```

## 关于Symbol的遍历
Symbol作为属性名时，`for in`和`for of`循环无法遍历出，也不会被`Object.keys()`，`Object.getOwnPropertyNames()`，`JSON.stringify()`返回。但这不代表Symbol是私有属性。
可使用`Object.getOwnPropertySymbols()`，返回一个数组，包含Symbol作为属性的键。

另外`Reflect.ownKeys`支持返回所有类型的键名，包括Symbol

根据Symbol的特性，可以为对象设置一些非私有，但仅希望适用于内部的方法或属性，不背外部遍历获取到。

## Symbol.for和Symbol.keyFor
因为Symbol的唯一性，每次声明都是一个全新且唯一的Symbol，如何获取到我们之前已经声明过的Symbol呢？
使用`Symbol.for`，先搜索在全局环境中已经登记过的Symbol，有，则返回搜索到的，无，则在全局环境中登记并创建新的。

```js
  Symbol.for('bar') === Symbol.for('bar') // true 全局登记过，第二次使用则为同一个
  Symbol('bar') === Symbol('bar') // false 每次使用都是新生成的唯一Symbol
```
使用`Symbol.keyFor`，获取已登记过的Symbol值的登记名称。
```js
  let a = Symbol.for('name');
  Symbol.keyFor(a) // name
```
根据`Symbol.for`的全局，登记的特性，可以对其挂载同一个实例，保证我们每次调用都是同一个实例，而不会再次生成。

## Symbol具有内置的值
内置了11个Symbol值，指向语言内部使用的方法。
