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
这里的关键其实就是多了个~，因此顺腾摸瓜，从webpack官网查找~相关的，在官方中文文档的LOADERS列表中，关于less-loader中有介绍，~利用了webpack的高级特性，将查询参数（这里应该就是传递的图片路径）传递给webpack resolver，告诉webpack从node_modules模块中查找less模块（类似于js模块的导入）。**~其实就被解析为webapck.config.js所在的根目录**。