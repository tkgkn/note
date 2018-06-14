# Vue中的钩子
单页面应用通常都会用到vue-router，在一个组件或者页面被展示或销毁时，生命周期钩子和路由守卫协作搭配，能够时刻控制组件和页面在不同阶段触发我们自己的函数。然而，分清楚生命周期和路由守卫各自的使用场景很重要，不能混为一谈。未区分清楚，就容易犯错，如下场景案例，都是我犯错的真实案例。

## 错误案例
如下实际工作中用错的案例。

### 错用场景1
A页面(组件)中打开了A-1页面(组件)，然后由A-1页面返回到A页面，在A页面的`activated`钩子中写了函数，期待能够在A-1返回至A时触发，事实是没有触发，因为没有弄清楚`activated`钩子函数的触发场景，这里实际应该用路由守卫来触发。

### 错用场景2
Home页面中打开A页面，A页面返回Home页面。
Home页面中打开B页面，B页面返回Home页面。
以上操作，需要在进入A,B页面时根据页面更改title为A或B，均需要在返回Home页面时，在把title改为home。我在Home，A，B三个组件中写了`beforeRouteEnter`守卫，挂载了修改title的函数。然后只有A，B有效，Home只有在初次进入时有效。没有弄清楚操作行为B->Home，A->Home不属于`beforeRouteEnter`，路由变化是这样的: `/home/A`->`/home`。
解决方式：Home组件中使用`beforeRouteUpdate`，判断`to.path === '/home'`触发修改title。A,B组件中使用`beforeRouteLeave`判断`to.path === '/home'`触发修改title。或者在`beforeEach`中对路由的各个操作做判断。

## 生命周期钩子
生命周期钩子是比较常用的，不管是在根实例还是在单文件组件中。都经常会用到。

### 写法注意
所有钩子函数，自动绑定this（实例本身）。所以不能使用箭头函数，箭头函数绑定的this是父作用域。
```js
// 注意，这里是最简单的引用vue.js后，然后直接在全局实例化Vue
// 因此var vm 等同于window.vm
var vm = new Vue({
  // right
  created() {

  }

  // 上面写法等同于如下写法
  created: function() {
    // this指向Vue实例本身
  }


  // error 这种写法错误
  created: () => {
    // 箭头函数绑定的是父作用域，这个例子中this指向window
    // 因此箭头函数的话this指向并不是你期待的
  }
})
```

### 生命周期函数
**beforeCreate**：实例初始化之后，实例还没有创建完成，因此访问this的话，是undefined。

**created**：实例创建完成，但是未完成DOM挂载。因此this.$el是访问不到的。这里可以执行watch，methods等方法了。常用来挂载页面数据初始化（不涉及到DOM操作）。

> 涉及到dom挂载，挂载后的重新打补丁渲染，销毁等钩子，都不会在服务端渲染阶段被调用。可以理解，因为服务端只会对页面做一次初始化，按照初始渲染，生成HTML，发送到客户端（浏览器端）。这块猜测如此，后期学习ssr方式后验证。

**beforeMount**：在挂载DOM到之前的一个钩子函数。能访问到this.$el，就是需要挂载的元素DOM（原始模板）。**注意**：$el即挂载的根节点，如`<div id="app"></div>`，如单文件组件`<template><div></div></template>`中的div根节点。如果是单文件的方式，在组建中beforeMount不一定能获取到$el，官方文档在**mounted**钩子函数中有说明。

> 注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted。

**mounted**：el选项被新创建的$el替换，且$el挂载到实例上之后（即vm.$el），调用该钩子。通常会在该钩子阶段，操作DOM。这里可以访问到ref标记的DOM结构。

**beforeUpdate**：数据发生变化时，在虚拟DOM打补丁之前调用。可以访问数据更新前那个状态下的DOM。

**updated**：数据发生变化且虚拟DOM补丁打完之后。DOM更新成功，可以执行一些依赖DOM的操作。不应该在该钩子重新更改状态，考虑用watch和computed。类似mounted，不保证所有组件都重绘完成。如果需要确认所有组件重绘完成，使用$nextTick。

**beforeDestroy**：实例销毁之前调用。实例销毁，如v-if，vue-router中切换视图等都会触发该钩子。

**destroyed**：实例销毁之后调用，完全销毁，包括子实例也会销毁，同触发该钩子函数。

**activated**：组件相关的钩子，只有keep-alive包裹的组件，重新激活时会触发。通常我们会在`<router-view></router-view>`外套一层`<keep-alive></keep-alive>`，单页面应用，频繁切换视图，减小重新渲染开销。如果使用了keep-alice，会触发`activated`钩子，但是由于组件被缓存在内存中，没有销毁，也没有重新创建，因此从第二次渲染同样组件时不会触发`beforeCreate`,`created`,`beforeMount`,`mounted`等钩子，这点应该很好理解。而`beforeDestroy`,`destroyed`则永远不会被触发。

**deactivated**：组件相关的钩子，只有keep-alive包裹的组件，被停用时触发，类似于destroyed，但是不是真的销毁，而是存到内存放到一边，暂时不用这个组件，keep-alive形式的组件切换会触发该钩子。

## 路由守卫
分为3种类型守卫：全局型，单个路由独享型，组件内调用型。
通常回调函数有3个参数to, from, next。to，from均为对象，存放路由跳转目的地的参数和来源地的参数，而next为函数，类似于管道操作，进入到下一个钩子，不执行的话，通常会导致路由中断。

## 全局型
### beforeEach
全局前置路由。进入某路由之前触发。

### beforeResolve
全局解析路由。导航确认之前，同时在所有组件内调用型路由守卫和异步路由组件被解析之后，该解析守卫就会被调用。这里涉及的执行条件需要理解的是，1是`导航确认之前`，导航的确认是指全部的钩子执行完，导航状态就是确认的(confirmed状态)。2是`组件内路由守卫和异步路由组件都被解析`，指的是路由内调用型的3个守卫`beforeRouteEnter, beforeRouteUpdate, beforeRouteLeave`，异步路由组件解析后(懒加载，通过Import()函数或require方式，用到的时候会去加载再解析，没用到就不存在加载解析一说)。简单来说，等组件内调用型守卫执行完了，异步组件也加载完了，才会执行`beforeResolve`。

### afterEach
全局后置钩子。没有next参数，可以理解，毕竟都已经后置了。在路由操作流程的最后触发。需要注意的是，这个钩子看起来是最后一个执行的钩子没错，但是在组件内调用守卫`beforeRouteEnter`的参数`next`中的回调函数，才是最后执行的，此时实例已创建好，所以可以在回调中访问到vue实例！！！

```js
var router = new VueRouter({
  routes: []
})

router.beforeEach((to, from, next) => {
  console.log('我是老大，第一个执行')
  next();
})

router.beforeResolve((to, from, next) => {
  console.log('我是保姆，大家都加载好，我在加载')
  next();
})

router.afterEach((to, from, next) => {
  console.log('我是看起来的最后一名，不过好像有一个哥们比我还靠后，这哥们是beforeRouteEnter的回调参数next')
  next();
})
```
没有路由地址的情况下，上述3个全局路由会被各自执行一遍！。

## 单个路由独享守卫
### beforeEnter
在路由配置里面单独配置的。
```js
var router = new VueRouter({
  routes: [
    {
      path: '/name',
      componet: Name,
      beforeEnter: (to, from, next) => {
        console.log('进入name时调用，在组件内调用的守卫之前')
        next();
      }
    }
  ]
})
```


## 组件内调用守卫
### beforeRouteEnter
在渲染当前路由组件对应路由被`完全确认(confirm)`前调用。因为此时，组件实例还未被创建。所以拿不到this即组件实例。但可以通过next的回调函数拿到实例
```js
export default {
  name: 'comp',
  beforeRouteEnter(to, from, next) => {
    console.log('进了当前组件且在路由确认前调用')
    next((vm) => {
      console.log(vm)
    })
  },
  beforeRouteUpdate(to, from, next) => {
    console.log('进了当前组件，或在当前组件打开子路由组件父组件仍存在，但内容已经不一样了，需要更新，会调用')
    // 如 home中打开A组件，/home -> /home/A。 回到home组件，/home/A -> /home
    next();
  },
  beforeRouteLeave(to, from, next) => {
    console.log('离开当前路由组件对应的路由时调用')
    next();
  }
}
```

## 导航完整的解析流程
导航触发，肯定是从一个路由地址跳往另一个。我们这里考虑这种情况`/home/A -> /home/B`，涉及到所有守卫;
1. 触发A的`beforeRouteLeave`
2. 触发全局的`beforeEach`
3. 触发Home组件中的`beforeRouteUpdate`
4. 触发B的独享路由守卫`beforeEnter`
5. 解析异步组件
6. 触发B的组件级守卫`beforeRouteEnter`
7. 触发全局的`beforeResolve`
8. 导航确认
9. 触发全局的`afterEach`
10. 触发DOM更新
11. 组件实例创建完成，调用`beforeRouterEnter`中传递给`next`的回调函数，回调函数可传vm，即实例对象。
