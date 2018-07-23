# 字符串扩展

ES6 针对字符串做了一些新的扩展，比如 API。本文只记录一些常用的 API。

## Unicode 表示法

JS 允许使用`\uxxxx`表示字符，其中`xxxx`是字符 Unicode 的码点。该方法只允许表示`\uxxxx~\uFFFF`之间的双字节字符。
如下例子特殊的字符则必须使用 2 个双字节表示。超过 4 个码点的如`\u20BB7`无法正常表示，这里会展示一个乱码加数字 7。

ES6 中可以将码点放入大括号，即可正常解读该文字。`\u{20BB7}`

提供了新 API`codePointAt()`，获取 4 个字节存储的十进制码点。

```js
var s = '𠮷'

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

提供了新 API`fromCodePoint`，将码点返回对应字符，可识别超出`0xFFFF`范围的字符

```js
String.fromCodePoint(0x20bb7)
```

## 字符串增加了遍历器接口 Iterator

```js
for (let s of 'foo') {
  console.log(s)
}
// 'f' 'o' 'o'
```

## includes()，startsWith(), endsWith()

首先，不是 include，startWith，endWith，都要加`s`。

```js
let str = 'abc'
str.includes('a') // 返回布尔值，是否存在a
str.endsWith('a') // 返回布尔值，是否以a结束
str.startsWith('a') // 返回布尔值，是否以a开始
```

## 's'.repeat(n)

返回一个新的字符串，s 重复 n 次的字符串。
`注意`，字符串是不允许改变的，所以字符串的方法都是返回新字符串。

```js
let r = 's'.repeat(3) // sss
```

## padStart(), padEnd()

字符串的开头和结尾，以某字符开始补齐。

```js
let a = 'abc'
a.padStart(6, 'z') // zzzabc 字符串长度补到6为止，以z补在开头部分
a.padEnd(6, 'a') // abcaaa 字符串长度补到6为止，以a补在结尾部分
```

## 模板字符串

以```作为模板字符串的起始和结束位`。变量以`${x}`表示。
${}内部还接受一些表达式，可以运算，功能很强大。

```js
let a = '名字'
let b = 'Mike'`我的${a}是${b}`
```

## 标签模板（补）

基本使用在模板字符串符号，第一个的前面写一个函数名即可。如下`tag`就是标签模板函数。
`tag`${var}``。
_注意_：标签模板的函数接收多个参数，其中第一个和第二个往后是不同的。

1.  第一个参数是一个数组，包含所有的普通字符串。比如`我是${school}的老师`。这里就是`['', '我是', '的老师']`。
2.  第二个参数我们可以写成`rest`模式，比如`...args`，包含了所有`${var}`的解释值（也就是结果）的一个数组，这样我们处理起来会方便很多。

```js
let count = 10,
  price = 0.25,
  unit = '$'

let message = passthru`${count} items const (${unit}单位): ${(
  count * price
).toFixed(2)}.`

function passthru(literals, ...substitutions) {
  let result = ''
  for (let i = 0; i < substitutions.length; i++) {
    result += literals[i]
    result += substitutions[i]
  }
  result += literals[literals.length - 1]
  return result
}

console.log(message) // 10 items const ($单位): 2.50.
```

因此，我们可以通过标签模板，来自定义转换，特别适用于 html 恶意字符过滤。用户可能会输入`<script>恶意代码</script>`，我们可以使用标签模板，函数中过滤调`<,>,&`等字符。

```js
function passthru(literals, ...substitutions) {
  let result = ''
  for (let i = 0; i < substitutions.length; i++) {
    result += literals[i]
    result += substitutions[i]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
  result += literals[literals.length - 1]
  return result
}
```

## 获取转义前的字符串原始值 String.raw
用途：比如写技术文档，需要输入包含原始代码的文档。
```js
let message1 = `Multiline\nstring`,
  message2 = String.raw`Multiline\nstring`
console.log(message1) // 会正常换行
console.log(message2) // 展示原本的文字 Multiline\nstring
```
