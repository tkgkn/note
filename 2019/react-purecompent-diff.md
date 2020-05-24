# React PureComponent 的浅比较

在使用 `antd`  的 `form`  组件时，使用到了 `getFiledDecorator`  去包装了表单组件，其中一个表单组件是颜色选择器，颜色选择器这个表单组件是按  `antd`  自定义表单组件的方式，同时该组件也是用 `PureComponent`  声明的。

然后我在使用 `setFiledValue`  去修改另一个表单组件 A 的值时，发现，也会触发颜色选择器组件的 `render` 。原以为只会触发我修改的 A 的渲染才对。

测试发现，如果不使用 `getFiledDecorator`  的话，是不会给组件添加额外的 `props`  的，此时你去修改 A 组件的值，颜色选择器配合 `PureComponent`  声明的方式，接收到的新旧  `props`  都是 `{}` 。如果使用了 `getFieldDecorator`  进行包装的话，即便是 `PureComponent`  也会渲染组件，得到的新旧 `props`  如下：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/241313/1578574171429-c0c467d6-fc64-44a8-83dc-1f3d09f77c49.png#align=left&display=inline&height=252&name=image.png&originHeight=504&originWidth=1182&size=95136&status=done&style=none&width=591)

然后找了下 `PureComponent`  组件默认的浅比较方式，发现的确会出现以上描述的情况。

自带的浅比较函数如下，其中 `is`  函数是 `Object.is`  的实现，只不过处理了 2 个特殊的情况，即让 `+0 === -0` , 让 `NaN !== NaN` 。

```javascript
if (ctor.prototype && ctor.prototype.isPureReactComponent) {
  // 先判断组件是否继承的PureComponent
  return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
}

function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    // 先用React实现的Object.is去比较2个参数，基本是同类型，同值，同引用的比较，如果不同，在往下比较。
    return true;
  }

  // 如果有一个参数的类型是对象，则肯定是不相等的（仔细理解第一个if的比较，同类型同值同引用，如果引用不同，肯定不等，那对象和JS的基本类型更不可能相等）
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  // 浅比较对象引用，获取2个参数的键名长度，不一致肯定不等。一致的话，在下面进行对象的第一层比较
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      // 比较A的键名是否存在于B对象中，用的是hasOwnProperty。
      !hasOwnProperty.call(objB, keysA[i]) ||
      // 如果存在，看看A和B同键名的值是否引用相同（如果是对象），这里用is函数来搞定。
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  // 浅比较结束，这里返回trur, 认为两者相等。
  return true;
}
```

所以在解释开篇提到的场景，两个 `{}`  的比较，比较到了最后一步，for 循环时，没有长度，里面没法走，直接到最后 `return true`  了。

然后包装后，Props 变多了，然后就进到了 for 循环里比较，发现深层的对象引用不一致。（这里有个疑惑，可能在第一步 is(A,B)就已经判断出来引用不同了，具体看 antd 的传参 Props 是怎么写的，是一个变量还是一个手写{}）
