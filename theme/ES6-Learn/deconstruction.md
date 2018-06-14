# 解构赋值
简单理解，即是`=`的左右两边，拥有相同模式，将右边的值赋值给左边的变量。

## 基本使用
单一赋值的方式几乎占据ES6之前
```js
  var a = 1;
  var b = 2;
```

进入ES6，允许我们按模式赋值。
```js
// 数组解构
let [a, b, c] = [1, 2, 3]
console.log(a, b, c); // 1, 2, 3

// 对象解构
let {age, name} = {age: 18, name: 'jack'}
console.log(age, name); // 18 jack
```

**不完全解构**也是可以的，左侧模式匹配右侧，明显左侧变量与右侧值相比，缺少了一部分。
```js
// 数组解构
let [a, b, , d] = [1, 2, 3, 4]
console.log(a, b, d) // 1, 2, 4

// 对象解构
let {a, b} = {b: 2}
console.log(a, b) // undefined 2
```

当然解构也存在失败情况，右侧的值不够，无法对应左侧变量。
```js
let [a, b] = []
console.log(a, b) // undefined undefined
```
记住**模式一定要匹配**这样不会出错，如下都无法正常解构。

如下情况，报错提示可以判断出，想要解构赋值，必须是具备Iterator接口（可遍历）。
```js
  let [a] = 1; // Uncaught TypeError: Invalid attempt to destructure non-iterable instance
  let [a] = false;
  let [a] = NaN;
  let [a] = undefined;
  let [a] = null;  
```

如下情况，2遍模式并不一致，对象是按照key来匹配，数组则是按照数组下标来匹配。
```js
  let {a, b} = [1, 2]
  console.log(a, b) // undefined undefined

  // 可以理解成进行了如下转换
  let {a, b} = {"0": 1, "1": 2}
```

## 支持默认值
模式匹配，左侧变量可以设置初始默认值，若右侧值并未传递的情况。
```js
  let [a, b = 2] = [1]
  console.log(a, b); // 1, 2
```
```js
  let {a = '1', b} = {b: 2}
  console.log(a, b)
```

**注意**因为数组解构是按照下标index进行模式匹配，所以1会对应左侧的a，重新赋值给a传递的1。而对象解构则是依靠`key`值，所以a对应的就是a，b对应的就是b，不用在乎传递值的顺序。
```js
  let [a = 3, b = 2] = [1]
  console.log(a, b) // 1, 2
```

## 可嵌套解构赋值
嵌套的话，一眼看去会相对复杂一点。但也是按照模式来进行匹配。
```js
  // 数组解构
  let [a, [b, c], d] = [1, [2], 3]
  console.log(a, b, c, d); // 1 2 undefined 3
```
对象嵌套的话，稍复杂，先看一个简单的例子，阐述模式和变量的关系
如下，简单，利用key的匹配，name对应name。
```js
  let {age} = {age: '18'}
  console.log(age); // 18
```

当然，也可以利用其它变量来匹配`18`的值。如下代码看起来模式更为对称，此时就是myage对应18，而左侧的age仅仅是一个模式，并不是声明的变量，因此无法访问。通过这个模式去匹配右侧的key。上面的代码示例可以看成`let {age: age} = {age: '18'}`
```js
  let {age: myage} = {age: '18'}
  console.log(myage); // 18
  console.log(age); // age is undefined
```

接下来我们再看下对象解构的嵌套。这里用到了数组解构和对象解构。左侧的p是一个模式，只是用来查找到右侧对应的key值p。
```js
  let obj = {
    p: ['hello', {name: 'jack'}]
  }
  let {p: [indexZero, {name}]} = obj
  console.log(indexZero, name); // hello jack
  console.log(p); // p is not defined
```

当然，如果想访问p，对应右侧obj下的p的值。我们可以这么写。
```js
  let obj = {
    p: ['hello', {name: 'jack'}]
  }
  let {p, p: [indexZero, {name}]} = obj
  console.log(p); // ['hello', {name: 'jack'}]
```

## 无值条件：x === undefined
ES6中解构赋值采用`x === undefined`的方式来判断左侧模式中变量对应的右侧是否有值。如下则是正常赋值。
```js
  // 对象解构
  // 正常赋值b
  let [a, b] = [, null]
  console.log(a, b) // undefined null


  // 对象解构
  // 正常赋值b
  let {a, b} = {b: null}
  console.log(a, b) // undefined null
```
**注意**：小心暂时性死区。未声明y时就使用y，`x = y`。这里不要使用babel等ES6转ES5工具，因为let会被转成var，则可以先使用后声明了。
```js
  let [x = y, y = 1] = []; // Uncaught ReferenceError: y is not defined
```
但是反过来就可以，因为先对y进行了声明，`let y = 1`
```js
  let [y = 1, x = y] = [];
  console.log(x, y); // 1 1
```

## 字符串解构
```js
  let [a, b, c, d, e] = 'hello'
  console.log(a, b, c, d, e)
```
另外，字符串有一个属性`length`，因此我们可以解构的方式访问到字符串的length
```js
  let {length: len} = 'hello'
  console.log(len); // 5
```

## 数值和布尔值解构
解构规则，若右侧不是数组或者对象，则转换成对象。如下，转换成Number类型的对象后，Number所具备的方法toFixed可以被访问到，因此`s`对应了`toFixed方法函数`，我们可以使用s。**注意**`toFixed`会对数字进行四舍五入取整，并转换为字符串。
```js
  let {toFixed: s} = 1;
  console.log(s)
  console.log(s.apply(12.56)) // '13'
```

相同的布尔值也会转成对象
```js
  let {toString: s} = true;
  console.log(s)
  console.log(s.apply(false)) // 'false'
```

## 函数参数的解构赋值
很常用的方式。形参是个数组，在函数内部以变量方式被访问。如下的[[1,2], [3,4]]中[1,2]和[3,4]都是被作为整体参数传递给[x, y]，解构成x = 1, y = 2和x = 3, y = 4
```js
  function test([x, y]) {
    return x + y
  }
  test([1, 2]); // 3

  let ret = [[1,2] ,[3,4]].map(([x, y]) => {
    return x + y 
  })
  console.log(ret) // [3, 7]
```

## ()在解构中的使用
1. **声明语句**时不可使用()。
  如下let，var, const，另外函数参数也属于变量声明。
  ```js
    let [(a)] = [1]

    function test([(a)]) {
      console.log(a)
    }
    test([a])
  ```

2. **模式部分**不可以使用()。
  如下[a]是一个模式对应右侧的[1]。

  ```js
  ([a]) = [1]; // parcel的提示：You're trying to assign to a parenthesized expression, eg. instead of `([a]) = 0` use `([a] = 0)`
  ```
  如下则没问题，首先不是声明语句，只是个简单的赋值语句，其次，这里的模式对应的只是数组，而(a)只是作为数组的第一个成员，跟右侧的成员1，是对应的。因此这里访问a，会得到1。
  ```js
    [(a)] = [1]
  ```  

## 解构的使用场景
1. 交换值
  ```js
    let a = 1
    let b = 2
    [a, b] = [2, 1]
  ```
2. 拿到函数返回的多个值
  ```js
    function create() {
      return [1, 2, 3]
    }
    let [a, b, c] = create()
    console.log(a, b, c)
  ```
3. 提取JSON值
  ```js
    let result = {a: 1, b: 2, c: 3}
    let {a, b, c} = result
  ```
4. 配合for of对Iterator接口实现遍历，具有Iterator接口的都可以
  ```js
    let map = new Map()
    map.set('a', 1)
    map.set('b', 2)
    for(let [key, val] of map) {
      console.log(`${key}: ${val}`)
    }
  ```
5. 获取指定的模块输出方法
  ```js
    // 这里vuex对外暴露的应该是类似{mapGetters: fn, mapActions: fn, ...}一个对象
    import {mapGetters, mapActions} from 'vuex'
  ```
