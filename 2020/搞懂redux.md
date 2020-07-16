# Redux

> 为什么有这篇文章？
> 因为使用 react 技术栈有一段时间了，相应的 redux 状态管理库也使用很久，偶尔一段时间不用，发现就会忘记某些 api，甚至是看过的主要是实现原理又忘的一干二净。
> 所以总结一下，以便忘记后查阅，迅速让大脑有个印象。

## 是什么？

一个单向数据流的状态管理库。

## 一些概念

APP 应用整个的状态都存放在单一的`Store`中心，修改`Store`的唯一途径就是发起`Action`，`Action`到达`Store`后，会根据`Action`提供的动作类型，新的数据，结合旧的状态合成一个新的状态，这个合成新状态的过程称为`Reducer`。

- **Reducer** 实际上就是一个纯函数，相同输入，得到相同输出，输出 state。
  ```js
  function reducer() {
    return {
      count: 0
    };
  }
  ```
- **Action** 实际上是一个标注的 JS 对象，具有`type`属性，这是约定的，动作的类型，以便`reducer`针对不同动作，处理不同逻辑返回新的 state。

  ```js
  const addAction = {
    type: 'add',
    otherData: 'add num'
  };
  ```

**注意**：不能直接修改旧`Store`，而是生成一份新的`Store`。目的是为了能够跟踪状态变化，一切有迹可循。

## 基本使用

搭配`React`数据驱动视图框架，食用更佳！

1. 创建数据中心`Store`。接收一个 reducers 函数，该函数用于生成状态数据，无任何`action`时，`reducer`的计算将默认返回它所拥有的所有`state`。

   ```js
   import { createStore } from 'redux';

   const Store = createStore(reducers);

   export default Store;
   ```

2. 创建`createStore`所需的`reducers`。reducers 是一个函数，返回`store`。通常我们会有很多页面和组件，每个页面或组件有自己的`reducer`生成的`state`，将多个`reducer`合并为一个大的`reducers`就是整个 APP 应用需要的`store`。这种拆分方式方便我们对`state`业务数据模块化，每个模块只要负责维护部分数据即可。

   ```js
   // reducer只是一个函数，通过对之前的state和当前action的类型及参数的处理，返回新的的state
   function reducerOne(preState, action) {
     // 一般惯用switch case形式
     // 你也可以用if else if
     const { type } = action;
     if (type === 'add') {
       return {
         count: preState + 1
       };
     } else {
       return {
         count: 0
       };
     }
   }

   function reducerTwo(preState, action) {
     // ...
     return {
       name: 'hello'
     };
   }
   ```

   因为`createStore`只接受一个函数，所以我们可以利用`redux`提供的`combineReducers`，自动调用多个`reducer`，获取它们的`state`合并一下。
