# 关于webpack下导入Less模块
> 项目本身是用vue-cli搭建的模板。使用了less写样式。考虑到充分使用less的特性，所以肯定会有如mixin.less，base.less之类的公用less模块。


```css
@import '../../common/style/base.less';
@import '../../common/style/mixin.less';
```
当然可以这么写，完全的相对路径。经测试是没问题的。

但是既然是webpack，当然应该充分利用其特性。我也是在看了如慕课网的实战教程后，才了解过还有这种写法。
```css
@import '~common/style/base.less'
@import '~common/style/mixin.less'
```

平时一直这么写，没有关注过~这个符号到底代表的是什么。直到有一次写到一个背景图片的less通用函数，出了问题，如下
```css
  /*mixin.less中声明的该less函数，路径是在src/common/style/mixin.less*/
  .bg-set(@img) {
    background-image: url(@img);
    background-repeat: no-repeat;
    background-size: 100%;
  }

  /*在src/page/index/index.vue中使用该函数，图片存放在src/page/index/arrow.png*/
  .bg-set('./arrow.png')
```
结果报错，webpack提示大致意思是找不到Module：arrow.png。看了下报错详细，引用的arrow.png路径尽然是**src/common/style/arrow.png**，而不是理想下的**src/page/index/arrow.png**。

这个问题的确不好描述，网上搜索过相关问题，基本没有。后来在慕课网中发现有人回答了该问题。
```css
  /*mixin.less中函数改写为*/
  .bg-set(@img) {
    background-image: ~'url(@{img})';
    background-size: 100%;
    background-repeat: no-repeat;
  }
```
这里的关键其实就是多了个~，因此顺腾摸瓜，从webpack官网查找~相关的，在官方中文文档的LOADERS列表中，关于less-loader中有介绍，~利用了webpack的高级特性，将查询参数（这里应该就是传递的图片路径）传递给webpack resolver，告诉webpack***以模块查找的方式对待该路径***。有点懵逼，没关系，看下例子。

## 先看下js模块的的导入规则
```js
  <!-- 引用Vue模块，优先会从Node核心模块查找，找不到的话，就从node_modules查找 -->
  var vue = require('vue')
  import Vue from 'vue'

  <!-- 如果传入的是一个相对路径，则按相对路径查找 -->
  var util = require('./utils')
  import util from './utils'

  <!-- webpack中可以配置alias（别名），假设@指代src/ -->
  import main from '@/common/main' // 这里加载的路径就是src/common/main.js
```
从上面大概能了解，webpack中，对js的引入，就是模块导入。webpack官方网站在less-loader和sass-loader中有这么一段相同话。
> 只要加一个 ~ 前缀，告诉 webpack 去查询模块。

因此，我们在css模块，或者html中只要在路径前面加一个~，实际上就是告诉webpack，按照模块加载方式来寻找对应的资源。
以下代码我们还是假设@是src的别名。
```css
  <!-- 因此问题迎刃而解 -->
  /*mixin.less中声明的该less函数，路径是在src/common/style/mixin.less*/
  .bg-set(@img) {
    background-image: url(@img);
    background-repeat: no-repeat;
    background-size: 100%;
  }
  /*在src/page/index/index.vue中使用该函数，图片存放在src/page/index/arrow.png*/
  .bg-set('~@/page/index/arrow.png') // 可以 遇到~，模块方式加载，将@/page/index/arrow.png 解析为 src/page/index/arrow.png。

  .bg-set('~./arrow.png') // 可以 遇到~，模块方式加载，将./arrow.png 按相对路径访问加载该模块资源，即在当前index文件夹中找到arrow.png。因此没问题。
```
至于改动less函数的方法。原理差不多

```css
  <!-- 对'url(@{img})'以模块方式搜索，因该函数被导入到当前less中，当传入./arrow.png时，以'~./arrow.png'的方式进行路径解析，跟上面第二种方式一致。 -->
  background-image: ~'url(@{img})';
```

至此，webpack中的~，大家应该都清楚不少。如果有不对的地方，欢迎指正。
