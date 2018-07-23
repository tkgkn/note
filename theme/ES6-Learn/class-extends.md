# class 的继承

ES5 中继承的步骤较为繁琐。如：

```js
function Parent() {}
Parent.prototype.fn = function() {}

function Son() {}
Son.prototype = new Parent()
Son.prototype.method = function() {}
```

ES6 中使用`extends`关键字就可以实现继承，方便清新。

```js
class Parent {
  constructor() {
    // ...
  }
}
class Son extends Parent {
  // 如果不显示调用父类的constructor，则会自动调用。

  // 显示的话，如下
  constructor() {
    super() // 调用父类的constructor函数
  }
  fn() {
    return super.toString() // 调用父类的toString方法
  }
}
```

_注意_：

1.  子类的`constructor`中必须调用`super`方法，否则创建实例会报错。
2.  只有调用`super`后，才能使用`this`关键字。

```js
class Point() {

}
class ColorPoint extends Point {
  constructor() {
    // 创建了构造函数，但是没有调用super
    this.color = color // 'this' is not allowed before super()
  }
}
let cp = new ColorPoint() // ReferenceError
```

## 判断类的继承关系

使用`getPropertyOf`可以从子类上获取父类

```js
Reflect.getPropertyOf(ColorPoint) === Point // true
```

## super 关键字

`super`既可以当做函数使用，也可以当做对象使用。两种情况下，用法完全不同。
_作为函数_：代表父类的构造函数。

1.  作为函数调用时，只能放在子类的`constructor`中，其他地方报错
2.  `super`代表的虽然是 A 类的构造函数，但在子类 B 中执行时，指向子类 B 的构造函数，这点看`new.target.name`即可知晓，这也说明`super()`（_父类 constructor 函数_）内部的`this`指向的是 B 实例

```js
class A {
  constructor() {
    console.log(this) // new B()调用时，打印出的this是B的实例
    console.log(new.target.name)
  }
}
class B extends A {
  constructor() {
    super() // 这里实际上调用的就是类A的constructor
  }
}

new A() // A
new B() // B
```

_作为对象_

1.  在普通方法中引用`super`，指向的是父类的原型
    如下例子中，`super`指代`A.prototype`。所以没有办法获取到 A 实例的属性和方法。
    在此时`super.p()`方法中的`this`指向 B 的实例。

```js
class A {
  P() {
    return 1
  }
}
class B extends A {
  constructor() {
    super()
    console.log(super.p()) // 1
  }
}
```

2.  在`static`方法中引用`super`，指向的是父类本身.
    注意，子类中静态方法通过`super`调用父类方法是，方法内部`this`指向当前的子类本身。

    ```js
    class A {
      static fn(msg) {
        console.log('static', msg)
      }
      fn(msg) {
        console.log('instance', msg)
      }
    }

    class B extends A {
      static fn(msg) {
        super.fn(msg)
      }
      fn(msg) {
        super.fn(msg)
      }
    }

    B.fn(1) // static 1

    var b = new B()
    b.fn(1) // instance 2
    ```
不管是作为对象还是作为函数使用，`super`的使用类型需要明确，不然会报错。
这里关于ES6类的继承的简单入门就到这，详细查看阮大神的ES6入门。
