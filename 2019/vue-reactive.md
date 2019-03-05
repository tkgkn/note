# Vue 的响应式收集

## 如何变成响应式数据

`Object.defineProperty`。不支持IE8及以下。所以Vue的兼容要注意。该函数，可以去定义一个属性的描述符，设置`get`和`set`，注意不能同`value`和`writeable`同时使用。

