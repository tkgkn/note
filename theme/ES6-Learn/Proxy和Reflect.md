# Proxy

代理，或者叫拦截器。对操作对象进行一层拦截，是一种机制。如果用过`axios`库的话，其的拦截器机制很像。
_注意_：目前支持 13 种拦截操作，比如获取值，设置值等。

## 基本使用：

代理语法很简单：`new Proxy(target, handler)`

```js
let obj = new Proxy(
  {},
  {
    get(target, key, receiver) {
      console.log(`getting ${key}`)
      return Reflect.get(target, key, receiver) // Reflect，简单看成Object对象的映射，可以使用Object的方法。Proxy支持的拦截方法，都可以在Reflect上找到并使用。
    },
    set(target, key, value, receiver) {
      console.log(`setting ${key}!`)
      return Reflect.set(target, key, value, receiver)
    }
  }
)

obj.count = 1 // setting count
++obj.count // getting count   setting count   2
```

上例代码，对一个空对象进行了一层拦截，重新定义了属性的读取操作。需要对生成的 Proxy 实例进行操作，而不是直接操作原目标对象（这里就是{}空对象），不然绕过代理，访问原目标对象，代理等于没有用。
再来看一个例子

```js
let proxy = new Proxy(
  {},
  {
    get(target, key) {
      return 35
    }
  }
)
proxy.name // 35 即便没有声明过该属性，依旧返回35，因为重新定义了获取操作。
```

_注意_：如果不对目标对象做任何代理行为，即便操作`Proxy`实例，也相当于直接操作原目标对象。如下

```js
let target = {}
let handler = {}
let proxy = new Proxy(target, handler)
proxy.a = 'b'
target.a // 'b'
```

再看一个例子，将 Proxy 作为其他对象的原型

```js
let proxy = new Proxy(
  {},
  {
    get(target, key) {
      return '原型属性不给你看'
    }
  }
)
let obj = Object.create(proxy)
obj.name // obj上并不存在name属性，根据原型链，会访问到proxy上去，触发get操作，返回 `原型属性不给你看`
```

## 拦截操作 13 种

`get(target, propKey, receiver)`：拦截对象属性的读取。如`proxy.foo`或`proxy['foo']`

`set(target,propKey,value,receiver`：拦截对象属性的设置，返回布尔值。如`proxy.foo = val`或`proxy['foo'] = val`

`has(target,propKey)`：拦截`in`操作符。如`propKey in proxy`，返回布尔值

`deleteProperty(target, propKey)`：拦截`delete`操作符，如`delete proxy[propKey]`

`ownKeys(target)`：拦截`Object.getOwnPropertyNames(proxy)`，`Object.getOwnPropertySymbols(proxy)`，`Object.keys(proxy)`，`for in`。返回一个数组，包含对象自身所有属性的属性名。其中`for in`和`Object.keys()`都只能获取可遍历的属性。

`getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。

`defineProperty(target, propKey, propDesc`：拦截`Object.defineProperty(proxy, propKey, propDesc)`和`Object.defineProperties(proxy, propDescs)`。返回一个布尔值。

`getPropertyOf(target)`：拦截`Object.getPropertyOf(proxy)`，返回原型对象

`setPropertyOf(target)`：拦截`Object.setPropertyOf(proxy)`，返回一个布尔值。如果目标对象是函数，还有额外两种操作可以拦截。

`apply(target, object, args)`：当拦截的目标对象是函数时，返回的`Proxy`实例则作为一个函数，当被调用时进行拦截。如`proxy(...args)`，`proxy.call(this, ...args)`，`proxy.apply(this, [args])`

`construct(target, args)`：当拦截的目标对象是函数时，返回的`Proxy`实例则作为一个函数，当被构造调用时进行拦截。如`new proxy(...args)`

`preventExtensions(target)`：拦截`Object.preventExtensions(proxy)`，禁止对象扩展，返回一个布尔值。

`isExtensible(target)`：拦截`Object.isExtensible(proxy)`，对象是否可以扩展，返回一个布尔值

# Reflect

与`Proxy`对象一样，为操作对象新增的 API。

1.  将 Object 对象的一些明显属于语言内部的方法放到`Reflect`对象上。
2.  修改某些 Object 方法的返回结果，变得更合理，如`Object.defineProperty(obj, name, desc)`在无法定义属性时会报错，而`Reflect.defineProperty(obj, name, desc)`则返回 false。
3.  让 Object 的操作都变成函数行为，如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.delete`则是函数行为。
4.  之所以放到跟`Proxy`对象一样说，是因为`Reflect`的方法和`Proxy`一一对应的。`Reflect`上的方法，都是默认行为，不管`Proxy`怎么修改，都可以方便快速的获取原本的默认行为。

针对上述描述4，如下代码
```js
  let proxy = new Proxy({}, {
    set(target, key, value, receiver) {
      let successFlag = Reflect.set(target, key, value, receiver) // 完成原本的默认行为
      // 增加额外行为
      if(success) {
        // do something
      }
    }
  })
```
这样，我们可以在不影响原生行为的基础上，去做别的事情，且语义化清晰，更容易理解。

## 13种静态方法
`Reflect.get`等13种静态方法是和`Proxy`对象支持的拦截方法一一对应的。
