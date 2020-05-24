# Class

ES6 定义了`class`类的写法。

## 简介

ES5 中，我们都是使用构造函数。跟传统的面向对象语言相比，差异很大。所以 ES6 中推出了`class`，写法更接近传统语言，但是它仅仅是一个语法糖而已，根本还是利用 ES5 原型继承等概念。

```js
// es5
function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function() {
  return `(${this.x}, ${this.y})`
}
var p = new Point(1, 2)

// es6
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  toString() {
    return `(${this.x}, ${this.y})`
  }
}

var p = new Point(1, 2)
typeof Point // function
Point === Point.protoype.constructor
```

上例代码用到了`class`，`constructor`构造方法，其内部`this`指向实例。类中的方法实际上都定义在`prototype`上。

```js
class Point {
  constructor() {}
  fn1() {}
  fn2() {}
}
// 等同于
Point.prototype = {
  constructor() {},
  fn1() {},
  fn2() {}
}
```

`class`中定义的方法，不可枚举。而`ES5`中`prototype`上声明的方法，是可以枚举的。

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
```

## 严格模式

ES6 的类中，默认是严格模式。
_注意_：

### constructor 方法

一个类必须有一个`constructor`方法，如果没有显示定义，则会默认添加。

```js
  clsss Point {

  }
  // 等同于
  class Point {
    constructor() {

    }
  }
```

`constructor`默认返回实例对象，但是可以指定返回另外一个对象。

```js
class Foo {
  constructor() {
    return Object.create(null)
  }
}
new Foo() instanceof Foo // false
```

### 类的实例对象

`class`声明的类，必须使用`new`的方式生成实例。
实例方法一律挂载到`prototype`上，而`constructor`中指定的`this`指向的则是实例对象本身。

```js
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  otherFn() {
    // ...
  }
}

var point = new Point(2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('otherFn') // false
Reflect.getPrototypeOf(point).hasOwnProperty('otherFn') // true
```

### class 表达式

类和函数一样，可以使用表达式的形式定义

```js
const myCls = class My {
  constructor() {
    //
  }
  fn() {
    return My.name
  }
}
```

需要明确的是，该`class`名是`myCls`，而不是`My`。`My`可以用在类的内部，指代当前类。

```js
// 可以省去My
const myCls = class {

}

// 甚至是立即执行
let person = new Class {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
}('name')

person.sayName() // name
```

### class 没有变量提升

```js
  new Foo() // ReferenceError
  claas Foo()
```

## 关于私有属性和方法

面向对象语言中，私有属性和方法是很长的。ES6 并不提供，所以我们变通实现。
一种方法是，仅仅是命名上加以区别，实际上还是可以调用

```js
class Widget {
  foo(baz) {
    this._baz(baz)
  }
  // 私有方法，采用_表示
  _bar(baz) {
    return (this.name = baz)
  }
}
```

方法二，是将私有属性挪到其他地方，类中采用`call`等方法调用。

```js
class Widget {
  foo(baz) {
    bar.call(this, baz)
  }
}
function bar(baz) {
  // ...
}
```

方法三，利用`Symbol`值的唯一性，将私有方法名字命名为一个`Symbol`值。但是如果被外部以`Symbol`的方式访问，还是会被调用到。

```js
const other = Symbol('other')

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  say() {
    return this.x + this.y
  }
  [other]() {
    return `other`
  }
}

var p = new Point(1, 2)
let r = p.say()
let r = p.other() // error
let r2 = p[other]()
console.log(r) // 3
console.log(r1)
console.log(r2) // other
```

关于私有属性和方法，有个提案是是采用`#`来表示。

```js
class Point {
  #x;
  constructor(x = 0) {
    #x = +x; // this.#x也行
  }
  // 注意,#x 和 x是2个不同的属性。
}
```

## this 指向

`class`类中的方法使用 this，默认指向类的实例。但使用时，小心可能会因为调用方法运行时所在的环境导致`this`指向意外。

```js
class Log {
  name(name = 'jack') {
    console.log(this)
    this.print(`hello ${name}`)
  }
  print(text) {
    console.log(text)
  }
}

const loger = new Log()
const { name } = loger
name() // 这时调用的环境，this指向了undefined（严格模式下），所以会报错。
```

上例的问题，在于调用时`this`的指向不是我们想要的，所以改变`this`指向即可。解决如下：

```js
// 通过bind绑定this
class Log {
  constructor() {
    this.name = this.name.bind(this)
  }
  name() {
    // ...
  }
}

// 改写一下，使用箭头函数绑定外部this
class Log {
  constructor() {
    this.name = (name = 'jack') => {
      this.print(name)
    }
  }
  print(text) {
    console.log(text)
  }
}
```

## class 中的属性存取器

1.  通过存取器，重新定义属性的存取。
2.  该存取器属性是放在`prop`的`descriptor`上的。

```js
class Cls {
  constructor() {}
  get prop() {
    return 'prop'
  }
  set prop(v) {
    console.log('setter' + v)
  }
}
let ins = new Cls()
ins.prop = 123 // setter 123
ins.prop // prop

var des = Reflect.getOwnPropertyDescriptor(Cls, 'prop)
'get' in des // true
'set' in des // true
```

## class 的 Generator 方法

还记得默认的`Interator`布置在`Symbol.iterator`上么。如果某个方法前面有个`*`，则是一个`Generator`函数。

```js
class Foo {
  constructor(...args) {
    this.args = args
  }
  *[Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg
    }
  }
}

// 至此，Foo类声明后就可以使用for of调用它内部的`Generator`函数了。
for (let x of new Foo('hello', 'world')) {
  console.log(x)
}
// hello
// world
```

## 静态方法 Static

就是不会被实例继承的方法，只能通过类来直接调用

```js
class Foo {
  static classMethod(who) {
    console.log(`${who} hello`)
  }
}
Foo.classMethod('class') // class hello

var foo = new Foo()
foo.classMethod('ins') // error
```

静态方法的`this`指向`class`本身，而不是实例。另外，可以看出，静态方法和非静态方法可以重名。

```js
class Foo {
  static bar() {
    this.baz()
  }
  static baz() {
    console.log('hello')
  }
  baz() {
    console.log('world')
  }
}

Foo.bar() // hello
```
子类可以继承父类的静态方法，甚至可以通过`super`直接调用父类的静态方法。
```js
class Foo {
  static classMethod() {
    return 'hello'
  }
  static parentName() {
    return 'world'
  }
}
class Bar extends Foo{
  fn() {
    console.log(super.classMethod()) // 非静态方法中调用静态方法报错！
  }
}
Bar.classMethod() // hello
var b = new Bar()
b.fn() // error
```

## 静态属性和实例属性
静态属性指挂在`class`本身的属性，即`Class.propName`。实例属性是生成的实例自己的`prop`。
ES6中规定，`Class`内部只有静态方法，没有静态属性，所以只有一种写法。
```js
  class Foo {

  }
  Foo.name = 'jack' // 静态属性
```
不过，新的提案中，我们可以这么写。
*书写实例属性*
```js
class MyClass{
  insName = 'jack' // 实例属性
  constructor() {
    console.log(this.insName) // jack
  }
}
```
*书写静态属性*
```js
class MyClass{
  static insName = 'jack' // 静态属性
  constructor() {
    console.log(MyClass.insName) // jack
  }
}
```

## new.target属性
该属性返回使用`new`命令调用的那个构造函数
```js
  function Person() {
    this.name = 'jack'
    console.log(new.target === Person) // true
  }
  var p = new Person()
```
*注意*：子类继承父类的话，`target`指向的则是子类。
```js
 class Rectangle {
   constructor(length, width) {
     console.log(new.target === Rectangle) // false
   }
 }

 class Square extends Rectangle {
   constructor(length) {
     super(length)
   }
 }

 var obj = new Square(3) // false 这里的target指向的是Square
```