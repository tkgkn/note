# 本文背景
工作和学习中大部分的vue工程都是通过vue-cli脚手架生成的，所以很少关注到vue实例创建那块，偶尔自己手写则会出现各种报错，比如该版本不包含编译器，请下载完整版本（带有编译器）的。因此趁着这个机会，详细了解了下vue的版本区别以及render函数的使用。

## 先认识下Vue提供的版本

### 完整版
包含了编译器的Vue代码。

### 关于runtime版本
创建Vue实例，渲染并处理虚拟DOM等的代码，不包含编译器

### 编译器是什么
负责将模板字符串变异成Js渲染函数的代码
```js
// 创建Vue实例，传入一个模板作为HTML渲染结构。需要编译器，在客户端进行模板编译的。
new Vue({
  template: '<div>{{title}}</div>'
})

// 通过render函数进行渲染，在构建时预编译为Js代码，最终生成的bundle中不在需要编译器。
new Vue({
  render(h) {
    return h('div', this.title)
  }
})

```
可以看出来，runtime版本和完整版本，最终都是编译为Js渲染函数代码。**差异**就是编译一个在开发人员代码构建时（打包器打包阶段），一个在客户端上调用时编译。

使用vue-cli构建的vue工程，可以看到vue实例的创建是这样的
```html
  <!-- App.vue -->
  <template>
    <div class="wrap">
      <v-nav></v-nav>
      <router-view></router-view>
    </div>
  </template>
  <script>
    import vNav from 'v-nav.vue'
    export default {
      name: 'App'
    }
  </script>
  <style></style>
```

```js
import App from 'App.vue'

// 这里的h实际上是createElement函数
new Vue({
  el: '#app',
  render: (h) => {
    return h(App)
  }
})
```


***但是***如果你尝试使用template来挂载模板，会报错。提示你需要完整版本
```html
<body>
  <div id="app"></div>
</body>
```
```js
import vComp from './v-comp.vue'

new Vue({
  el: '#app',
  template: '<div><v-nav></v-nav><router-view></router-view></div>',
  components: {
    vComp
  }
})
```
这是因为，采用webpack2+，或者parcel这类打包工具，都是引用的运行时版本**node_modules\vue\dist\vue.runtime.esm.js**。
如果你一定要使用template的话，可以配置一个别名，引用vue的完整版本即可。
如webpack:
```js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
```

## 关于render渲染函数

### 某些环境中代码更简练
> 这里引用官方文档的一个例子
```html
<!-- 一个vue单文件 -->
<template>
  <div>
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-if="level === 5">
      <slot></slot>
    </h5>
  </div>
</template>
```
```js
export default {
  name: 'title',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
}
```

这个组件实际就是根据传递的level来决定使用的到底是h1到h5中的哪一个。虽然思路清晰，但是代码冗长。采用render函数的来重写的话。

```js
Vue.component('heading', {
  render: (createElement) => {
    console.log(createElement(
      'h' + this.level, // h标签
      this.$slots.default // 插槽内容
    ))
    return createElement(
      'h' + this.level, // h标签
      this.$slots.default // 插槽内容
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

**注意**的是，createElement函数返回的是一个**虚拟DOM节点**（这个组件只是整个页面的一小部分），即VNode。而**虚拟DOM**则是对Vue组件树建立起来的整个VNode树的称呼。上面代码中的console会打印出如下类似内容。
![VNode](./img/VNode_object.jpg)

**注意**：createElement的参数有三个。
1. 参数1必填，可以是String（HTML字符串）, Object（组件选项对象）, Function（解析上述类型任何一种的异步函数）。
2. 参数2选填，Obejct，包含模板相关属性的数据对象，例如class, title等等。涉及的东西很多，查看官方文档[data对象](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5-data-%E5%AF%B9%E8%B1%A1)
3. 参数3选填，Array，String。子节点VNodes，**由createElmenet()函数返回一个VNode对象**，或者是字符串形式的文本节点。

在上例的代码中，我们只传递的2个参数，第二个传入的参数就是createElement函数的第三个参数，一个数组，数组中是多个对象，都是由createElement()函数返回的VNode节点。类似如下
![createElement返回的对象](./img/VNodes_createElement_return.jpg)

### VNodes(子节点)必须是唯一的
这里的唯一是指，createElement返回的VNode对象是唯一的，使用上也是唯一的，应该看做一个实例对象。而不能当做引用对象使用。
官方示例中，如下代码，同一个对象被多次引用使用，就是错误的。
```js
  render: function(createElement) {
    var onlyOneObject = createElement('p','hi'); // 参数1，p标签。参数2，字符串，子节点
    return createElement('div', [
      onlyOneObject, onlyOneObject // 数组中引用同一个VNodes
    ])
  }
```

一定需要重复渲染相同的元素/组件（即VNodes），采用工厂函数来实现。
```js
  render: function(createElement) {
    return createElement('div',
      Array.apply(null, {length: 20}).map(function(){ // apply第二个参数接受数组或类数组生成一个20个长度的数组，map该数组，返回对应的一个应用map传递函数的20长度的数组内容。即[VNodes, VNodes, ..., VNodes]
        return createElement('p', hi)
      })
    )
  }
```

### Js代替模板引擎常用的功能实现

#### v-if和v-for
```html
  <ul v-if="items.length">
    <li v-for="item in items">{{item.name}}</li>
  </ul>
  <p v-else>No items found.</p>
```

```js
// render函数中写法
Vue.component('forComp', {
  render: (createElement) => {
    if (this.items.length) {
      return createElement('ul', this.items.map((item,index) => {
        return createElement('li', item.name)
      }))
    }else{
      return createElement('p', 'No items found')
    }
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  }
})
```
#### v-model
```html
<input type="text" v-model="enterVal">
```
```js
// render函数中写法
Vue.component('oInput', {
  render: (createElement) => {
    var self = this;
    return createElement('input', {
      // DOM属性
      domProps: {
        value: self.enterVal
      },
      // 事件监听器，基于on
      on:{
        input: function(event){
          self.$emit('input', event.target.value); // 这里派发一个input事件，实际上对应应该是如下Html代码结构
        }
      }
    })
  },
  props: {
    enterVal: {
      type: [String, Number],
      required: true
    }
  }
})
```

```html
<!-- 猜测，本质上v-model应该是vue的语法糖，实现监听input事件，然后得到最新输入的值，更新视图 -->
<input type="text" v-on:input="">
```

#### 插槽
```js
  // 普通的插槽内容
  render: function(createElement) {
    return createElement('div', this.$slots.default)
  }


  // 生成带有作用域插槽的组件结构（可以传递数据的slot）
  props: ['message'],
  render: function(createElement) {=
    return createElement('div', [
      // $scopedSlots.default是一个函数，返回VNodes
      this.$scopedSlots.default({
        text: this.message
      })
    ])
  }


  // 向子组件中传递作用域插槽。
  rende: function(createElement) {
    return createElement('div', [
      createElement('child', {
        scopedSlots: {
          default: function(props) {
            return createElement('span', props.text)
          }
        }
      })
    ])
  }
```

```html
<!-- 上面3段渲染函数关于插槽的写法，对应的template结构应该是 -->
  <div>
    这里是slot的内容
  </div>


  <div>
    <slot :text="message"></slot>
  </div>


  <div>
    <child>
      <span slot-scope="props">{{props.text}}</span>
    </child>
  </div>
```

## 总结
本文主要是方便自己理解render函数究竟是做什么的，区分不同vue构建版本中使用render方式的差异，后半部分结合官方文档，了解了下render函数的其他简单用法。文章内容还是比较浅，建议大家去官方文档学习。