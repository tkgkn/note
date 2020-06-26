# 常见笔试题

## 防抖函数 debounce

频繁触发，只执行最后一次。

```js
function debounce(fn, delay) {
  const timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
```

## 节流函数 throttle

频繁触发，只执行第一次。

```js
function throttle(fn, delay) {
  let flag = false;
  return function () {
    if (flag) {
      return;
    }
    flag = true;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = false;
    }, delay);
  };
}
```

## 深克隆

简单版，有缺陷，函数无视，undefined， 循环引用会报错，Symbol 无视

```js
const copy = JSON.parse(JSON.stringify());
```

如果没有函数需要克隆，有个奇淫的方法，利用 `postmessage`，可以搞定循环引用

```js
function structuralClone(obj) {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => resolve(ev.data);
    port1.postMessage(obj);
  });
}
```

## Event Bus

```js
class MyEvent {
  constructor() {
    this.events = {};
  }

  static add(type, callback) {
    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }

  static remove(type, callback) {
    if (this.events[type]) {
      const index = this.events[type].findIndex(callback);
      this.events[type].splice(index, 1);
    }
  }

  static emit(type) {
    if (this.events[type]) {
      this.events[type].forEach((item) => {
        item();
      });
    }
  }
}
```

## 实现 instanceOf

先考虑下这个操作符做了什么？ 语法是`sonInstance instanceOf SonClass`，判断`SonClass`原型是否出现在`sonInstance`的原型链上

```js
function myInstanceOf(ins, classTarget) {
  const types = ['object', 'function'];
  const insType = typeof ins;
  const classTargetType = typeof classTarget;
  if (!types.includes(insType) || !types.includes(classTargetType)) {
    return false;
  }
  if (typeof ins === null || typeof classTarget === null) {
    return false;
  }
  while (true) {
    const insProto = ins.__proto__;
    const classTargetProto = classTarget.prototype;
    if (insProto === classTargetProto) {
      return true;
    }
    ins = insProto;
  }
}

function Person() {}
var p = new Person();

console.log(myInstanceOf(p, Person));
console.log(myInstanceOf(p, Object));
```

## 实现 call

先看看 call 干了什么，接收的第一个参数是`this`指向，后面的参数都是函数的参数。语法是`fn.call(this, arg1, arg2, ...)`

```js
// fn.myCall(null, arg1...)
Function.prototype.myCall = function (context) {
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
```

## 实现 apply

跟 call 的区别，只有 2 个参数，第二个参数是一个数组，接收所有的参数。语法是`fn.apply(this, [param1, param2, ...])`

```js
Function.prototype.myApply = function (context, arg = []) {
  context = context || window;
  context.fn = this;
  let result = context.fn(...arg); // 要是做兼容的话，要改写法，参数循环拼接成字符串格式，如'(args1, args2, args3)'，通过eval来调用
  delete context.fn;
  return result;
};
```

## 实现 bind

bind 方法，接收一个参数作为函数调用时的 this，并返回这个绑定了 this 的函数。

```js
Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  if (typeof fn !== 'function') {
    throw new TypeError('Not a function');
  }
  return function F() {
    if (this instanceof F) {
      return new fn(...args, ...arguments);
    }
    return fn.apply(context, ...args, ...arguments);
  };
};

function person() {
  console.log(this.name);
}
var p = {
  name: 'hello',
};
var newPerson = person.bind(p);
```

## 模拟 new，Object.create

见文章**2020-探究继承**

## 实现类继承

见文章**2020-探究继承**
