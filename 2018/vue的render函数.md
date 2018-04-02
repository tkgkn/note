# 本文背景
工作和学习中大部分的vue工程都是通过vue-cli脚手架生成的，所以很少关注到vue实例创建那块，偶尔自己手写则会出现各种报错，比如该版本不包含编译器，请下载完整版本（带有编译器）的。因此趁着这个机会，详细了解了下vue的版本区别。

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
这是因为，采用webpack2+，或者parcel这类打包工具，都是引用的运行时版本**node_modules\vue\dist\vue.runtime.esm.js**


## 关于render渲染函数