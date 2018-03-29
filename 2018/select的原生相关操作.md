# 学习背景
Vue中鼓励数据驱动，从而避免跟以前一样使用jQuery来操作DOM的方式操作select。业务开发中经常碰到select操作，所以写一篇记录下原生操作select相关的。

### 实际开发遇到的情况
因为option选项展示给用户看是一个文案，而跟后端约定传值，是对应的code。如果根据selectData的值做一个判断，少的话还行，如果是城市选择，相信大家都有过经验，传递的是城市对应的code，这个时候，如果一个个判断，是不可能的。如下情况：

```html
<div id="app">
  <select v-model="selectData">
    <option v-for="item,index in options" v-text="item.t" :value="item.v"></option>
  </select>
</div>
```

```js
  let vm = new Vue({
    data: {
      selectData: '2',
      options: [
        {t: 'one', v: 1},
        {t: 'two', v: 2},
        {t: 'three', v: 3},
      ]
    }
  })
```
### 获取对应value的思路
依赖了原生操作dom的方式，先获取到select，然后获取其selectedIndex属性值，该值返回的就是select中选中的那个option的数组下标。

>这里有几个平时经常会弄错的地方。

#### 关于v-model的绑定
应该绑定的是select，而不是循环结构里的option。

#### 关于@change事件的绑定
也是需要绑定在select上，而不是option。

下面看下原生方式获取对应option的text
```html
  <select v-model="selectData" @change="changeEvent" ref="selectDom">
    <option v-for="item,index in options" v-text="item.t" :value="item.v" ref="options"></option>
  </select>
```
```js
  {
    methods: {
      changeEvent() {
        let selectIndex = this.$refs.selectDom.selectedIndex; // 获取选中的index
        let selectOptionTxt = this.$refs.options[selectedIndex].textContent;
        console.log(selectOptionTxt); // 打印出对应的option的text
      }
    }
  }
  
```
还有一种方法可以获取，查看了下***$refs.options***，实际上就是option的dom元素集合。每一个元素（option）有很多属性，其中有一个***selected***属性，选中的opiton，其***selected***属性值为true。所以我们可以遍历下option，查看其***selected***属性，如果是true，则锁定该option。
```js
  // 示意代码
  let selectOption = null;
  [].forEach.call(document.querySelectorAll('option'), function(item, index){
    if (item.selected) {
      selectOption = item; // 确定了选择的option
    }
  })

  console.log(selectOption.textContent);

  // 顺提一下获取select最终选择的值。Vue中，通常是v-model绑定了data中的一个属性
  console.log(document.querySelector('select').value); 
```

# 总结
因为本人经常碰到此类情况，每次又不能顺利的搞定该问题，不是绑错了v-model，就是其他问题，因此记录该文。
如果哪位有更好的方案（比如用Vue的方式），不吝赐教啊~