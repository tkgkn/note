# 数组扩展
ES6主要对数组扩充了很多方法。下面我们来一一了解和学习下。

## 扩展运算符
在函数扩展一文中，我们在函数rest参数一文之后有介绍过，因为同样使用`...`运算符。这里我们在复习下。
```js
  // 展开一个数组，以,为分隔的序列
  let a = [1, 2, 3]
  console.log(...a) // 1, 2, 3

  // 复制数组
  let arr = [1,2,3]
  let copyArr = [...arr] // 因为...arr展开为1,2,3 加上外面的[]，又变成了数组

  // 我们可以合并数组
  let arr1 = [1,2]
  let arr2 = [2,3]
  let arr3 = [...arr1, ...arr2] // [1,2,2,3]

  // 将字符串转变为单个字符的数组，类似split('')
  [...'hello'] // ['h', 'e', 'l', 'l', 'o']

  // 搭配具有Iterable接口的对象使用
  [...new Set([1,2])] // [1, 2]
```

## Array.of()
这个方法就是生成一个数组实例，ES5也可以，但是ES5因参数传递的不同，结果不同。该方法规范了这一差异。
```js
  // ES5中
  Array(); // []
  Array(3); // [, , ] 生成一个数组长度为3，但元素都是空的数组
  Array(1,2,3) // [1,2,3]
  // 这个差异看起来真的很大，灵活性强，但是行为不统一。
```
```js
  // ES6中
  Array.of(); // []
  Array.of(3); // [3]
  Array.of(1,2,3); // [1,2,3]
```
该方法可以看成替代`new Array`和`Array`

## Array.from()
### 将类数组和可遍历（具备iterable接口，如Set和Map）对象转换为真正的数组。
```js
  // 类数组
  let arrayLike = {
    '0': 'a',
    '1': 'b',
    length: 2
  }
  let arr = Array.from(arrayLike) // ['a', 'b']

  // ES5中，可以利用slice实现浅拷贝
  let arr2 = [].slice.call(arrayLike) // ['a', 'b']
```
还有DOM集合，函数内部的arguments对象，都可以使用`Array.from`转换为真正的数组。
```js
  // 转换DOM集合
  let eles = document.querySelectorAll('div')
  let eleArr = Array.from(eles); // [DOM, DOM, ...] 每一个元素都是一个div dom

  // 转换具有iterator接口的结构
  let set = new Set(['a', 'b']);
  set instanceof Set; // true
  set instanceof Array; // false

  let setArr = Array.from(set)
  setArr instanceof Set; // false
  setArr instanceof Array; // true

  // 生成一个新数组，类似于slice
  let oldArr = [1,2,3]
  let newArr = Array.from(oldArr)
  oldArr[0] = 4
  console.log(newArr) // [1,2,3] 和 oldArr无关联
```
### 接收第二个参数，对数组元素进行处理，处理的值返放入返回的数组。类似map
```js
  let arr = [1,2,3]
  let filterArr = Array.from(arr, (x) => x > 1)
  console.log(filterArr) // [false, true, true]
```

## 数组实例方法copyWithin()
将数组中某一段截取到该数组的指定位置，不改变数组长度，但数组以改变。类似复制再选中一部分覆盖。`copyWithin(target, [start], [end])`
```js
  let arr = [1,2,3,4,5]
  arr.copyWithin(3, 2, 5) // 剪切3,4，不包括5，替换掉从3开始的位置。剪切了2位，就从位置3开始替换现有的2位。
  console.log(arr); // [1,2,3,3,4]

  // 负数，则倒着数。
  arr.copyWithin(0, -2, -1); // -2开始，即倒着数，等于正数数组第4个。-1结束，不包括-1，也就是不包括数组最后一个。截取的是4，然后从0开始替换，替换1位。
  console.log(arr); // [4,2,3,4,5]

  // 不传end参数，则end默认为数组长度。

  // 不传start和end，则数组不变。
```

## 数组实例方法find和findIndex
`find`是找出数组成员。`findIndex`是找出数组下标。只找出第一个符合条件的成员。  
用法：  
`find(callbackFn(value, index, originArray),thisObj)`;  
`findIndex(callbackFn(value, index, originArray), thisObj)`

```js
  // find
  let result = [1,4,5,10].find(n => n > 3)
  console.log(result) // 4
  
  let indexResult = [1,4,5,10].findIndex(n => n > 3)
  console.log(indexResult) // 1

  // 支持查找NaN
  // ES5的indexOf没有办法找到NaN
```

## 数组实例方法fill
以某个值，填充（覆盖）数组指定位置的每个元素。
`fill(value, [start], [end])`
```js
  // 覆盖所有
  let arr = ['a', 'b', 'c']
  arr.fill('d')
  console.log(arr); // ['d','d','d']

  // 指定位置
  arr.fill('d', 1, 2) // 不包括end
  console.log(arr) // ['a', 'd', 'c']
```
### 初始化一个数组，又不想空的。
```js
  let arr = new Array(3).fill(1) // [1,1,1]
```
### 用一个对象填充。填充的是对象的地址引用。
```js
  let arr = new Array(3).fill({name: 'jack'}) // [{name: 'jack'},{name: 'jack'},{name: 'jack'}]
  arr[0].name = 'Ben' // [{name: 'Ben'},{name: 'Ben'},{name: 'Ben'}]
```
