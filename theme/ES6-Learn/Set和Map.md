# Set和Map
ES6提供的新的数据结构。

# 关于Set
类似数组，但成员的值都是唯一的，不重复。
```js
  const s = new Set([1, 2, 3, 4, 5, 5, 6, 7, 7, 8])
  console.log(s) // Set(8) {1,2,3,4,5,6,7,8} 结构类似，这里仅表示，去除了重复项
```
根据唯一不重复的特性，我们可以用来做数组去重，非常简单。
```js
  [...new Set([1,2,3,4,5,4,5,6])] // 1,2,3,4,5,6

  // 注意如下
  [...new Set([1, '1'])] // 1 '1'
```
Set判断两个值是否相等的方法类似`===`，但认为`NaN`等于自身，这点不同于`===` 
```js
  [...new Set([NaN, NaN])] // [NaN]
```

## Set实例的属性
`size`，返回Set实例的成员总数，类似数组的`length`
```js
  let s = new Set([1,2,3,'3'])
  s.size // 4
```

## Set实例的操作方法
`add`，添加某个值，返回添加后的Set结构本身（实例本身）。这就提供了链式调用的可能
```js
  let s = new Set()
  s.add(1).add(2) // Set(2) {1, 2}
```

`delete`，删除某个值，返回布尔值，表示是否成功删除
```js
  let s = new Set([1, '1'])
  s.delete('1') // true Set(1) {1}
```

`has`，是否有某个成员，返回一个布尔值
```js
  let s = new Set([1, '2', 2])
  s.has('2') // true
```

`clear`，清空所有成员，没有返回值
```js
  let s = new Set([1, 2, 3])
  s.clear() // Set(0) {}
```

## Set实例的遍历方法
均返回遍历器结构，配合`for of`遍历。
`keys()`，返回包含键名的遍历器
`values()`，返回包含值的遍历器
`entries()`，返回键值对的遍历器
`forEach`，类似数组的方法，使用回调遍历每个成员
*特别注意*： Set的遍历顺序就是其成员插入的顺序，这点跟数组很像，顺序明确对我们业务逻辑上有很大帮助。

Set结构键值是同一个，所以`keys`和`values`方法的行为一致，所以`entries`遍历出的结果，是键值一样的数组。
```js
  let set = new Set(['red','blue'])
  for(let item of set.keys()) {
    console.log(item) // red blue
  }
  for(let item of set.values()) {
    console.log(item) // red blue
  }
  for(let item of set.entries()) {
    console.log(item) // ['red','red'] ['blue', 'blue']
  }
```

幸运的是，Set实例本身默认可遍历，其默认遍历器生成函数就是它的`values`方法，因此我们可以直接遍历实例，不需要调用其遍历方法。
```js
  let set = new Set(['red', 'blue'])
  for(let x of set) {
    console.log(x) // red blue
  }
```
## 遍历的应用
这里说下遍历时想同步改变原Set结构，目前没有直接方法，两个思路。
1、可利用`...`先转为数组，再使用数组的map方法获取到新的结果数组，再转为Set.
2、利用`Array.from`将Set实例转为数组，第二个参数传入处理函数，其返回的新数组再转为Set
```js
  let s = new Set([1, 2, 3])
  // 方法1
  s = new Set([...s].map(item => item * 2)) // Set(3) {2, 4, 6}
  // 方法2
  s = new Set(Array.from(s, item => item * 2)) // Set(3) {2, 4, 6}
```

## WeakSet
具有Set的唯一性特点，但是成员只能是对象类型。
不具备`size`属性，不具备`entries`，`forEach`方法。
其成员都是弱引用，垃圾回收不考虑WeakSet对对象的引用（不算引用计数的次数），从而不会发生内存泄露。
```js
  const weakSet = new WeakSet()
  weakSet.add(1) // 报错，不支持基本类型
  weakSet.add([1]) // WeakSet {[1]}
```

# 关于Map
Map类似对象，是一种键值对的结构，不同于传统Object只能将字符串当做建，Map可以使用任何类型作为键。因此Map比Object更适合作为一种键值对的数据结构。
```js
  let m = new Map() // 声明Map结构
  m.set({p: 'hello'}, 'world') // 添加成员。set方法，没有add。这里将一个对象作为了key

  // 声明式，可接收一个数组，数组成员即是[key, val]结构。
  let m = new Map([
    ['name', '张三'],
    ['age', '15']
  ])
  m // Map(2) {"name": "张三", "age": "15"}。
```
任何具备*Iterator*接口，成员是双元素的数组的数据结构，都可以作为Map构造函数的参数。因此，Map和Set数据结构本身也可作为Map构造函数的参数。
```js
  let set = new Set([
    ['name', 'jack'],
    ['age', 15]
  ])
  let map1 = new Map(set) // Map(2) {"name": "jack", "age": 15}

  let map = new Set([
    ['baz', 3]
  ])
  let map2 = new Map(map) // Map(1) {"baz": 3}
```
*注意*，Map的键因为可以为任何类型，因此特别注意下引用类型，通过get方式访问成员，如果是引用类型，则访问的是引用类型的指针。如下则为2个不同的引用类型指针。
```js
  let map = new Map()
  map.set(['a'], 555)
  map.get(['a']) // undefined
```
相反，如果键是简单类型的值，则只要两个值严格相等，就是同一个键。这里注意的是NaN被Map视作同一个键。
```js
  let map = new Map()
  map.set(-0, 123),
  map.get(+0) // 123

  map.set(NaN, 123),
  map.get(NaN) // 123
```

## Map实例的属性
`size`，返回成员总数。

## Map实例的操作方法
`set(key, value)`，设置成员，如果已存在，则覆盖更新。方法返回Map实例本身，因此可采用链式方法添加成员。

`get(key)`，获取成员对应的键值，找不到则返回undefined

`has(key)`，返回布尔值，判断是否存在某个成员

`delete(key)`，删除指定成员，返回布尔值，删除是否成功

`clear()`，清除所有成员

## Map实例的遍历方法
`keys()`，返回包含键名的遍历器
`values()`，返回包含键值的遍历器
`entries()`，返回包含键值对的遍历器
`forEach()`，遍历Map中所有成员

```js
  let map = new Map([
    ['F', 'no'],
    ['T', 'yes']
  ])

  for(let item of map.keys()) {
    console.log(item) // F T
  }

  for(let item of map.values()) {
    console.log(item) // no yes
  }

  for(let [item, value] of map.entries()) {
    console.log(item, value) // F no    T yes
  }
```
幸运的是，Map与Set类似，Map结构本身默认遍历器接口，对应其`entries()`方法。因此可以直接遍历Map结构。
```js
  for(let item of new Map([['F', 'no'], ['T', 'yes']])) {
    console.log(item) // ["F", "no"]  ["T", "yes"]
  }
```
因为`...`扩展运算符内部使用的是`for of`，因此我们可以使用`...`来快速展开Map数据结构
```js
  let map = new Map([
    ['1', 'one'],
    ['2', 'two']
  ])
  [...map.keys()] // 1, 2
  [...map.values()] // one two
  [...map.entries()] // [['1', 'one'], ['2', 'two']]
  // 默认遍历器
  [...map] // [['1', 'one'], ['2', 'two']]
```

## 与其他数据结构的互相转换
Map转数组
```js
  let map = new Map([
    ['1', 'one'],
    ['2', 'two']
  ])
  [...map] // [['1', 'one'], ['2', 'two']]
```
数组转Map
```js
  // 正常构造声明即可
  new Map([
    ['1', 'one'],
    ['2', 'two']
  ])
```
Map转对象（Map的键都是字符串，则可无损转为对象）
```js
  function mapToObj(strMap) {
    let obj = {}
    for(let [k, v] of strMap) {
      obj[k] = v
    }
    return obj
  }
```
对象转Map
```js
  function objToMap(obj) {
    let map = new Map()
    for(let k of obj) {
      map.set(k, obj[k])
    }
    return map
  }
```
Map转JSON，利用上面的函数，有条件（键为字符串）的转为对象后调用`JSON.stringify()`

JSON转Map，利用上面的函数，将JSON转为对象再遍历调用`Map.set(k, v)`

## WeakMap
1、成员只接受对象作为键名，不接受基本类型作为键名
2、键名所指的对象，均不计入垃圾回收机制（同WeakSet）
3、不具备遍历方法`keys()`，`values()`，`entries()`，`forEach()`，没有`size`属性
4、只有`get()`，`set()`，`has()`，`delete()`四个方法。
