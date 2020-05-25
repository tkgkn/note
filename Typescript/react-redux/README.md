<!--
 * @Description:
 * @Author: 小明
 * @Date: 2019-08-29 09:53:45
 * @LastEditors: 小明
 * @LastEditTime: 2019-09-17 11:39:26
 -->

# React 和 Redux 技术栈快速接入 TS 指南

> TS 的基本知识这里不做过多的介绍，请自己参照入门文档：[TS 入门文档](https://ts.xcatliu.com/introduction/get-typescript)。

推荐直接使用*create-react-app*直接生成支持 ts 的项目，然后进行 TS 代码测试，`create-react-app myProject --typescript`。或者直接使用 TS 官方提供的[TS 在线测试](http://www.typescriptlang.org/play/?esModuleInterop=true&target=6&jsx=2#code/JYOwLgpgTgZghgYwgAgCoHsAm7kG8BQyRyYwYANhAFzIDOYUoA5gNyHGYS0KMAOp6EDXqMQrfAF98+MAE9eKOMgC8yAApwopOOQA8GbAD4gA)。

## 常用 React 内建常用类型

> 建议先浏览一遍有印象

- `React.FC<Props>`，定义函数组件用。

- `React.Component<Props, State>`，定义类组件用。

- `React.ReactNode`，用来定义各种 react 节点，比如`<div />`, `<MyComp />`, `this is a just a text`, `null`, `0`...

- `React.CSSProperties`，用来定义内联`style`的。

- `React.HTMLProps<HTMLXXXELEMENT>`，获取内建 html 元素的属性。
-
- `React.PropsWithChildren`，如果需要显示使用 children，使用该类型创建 props，如：`React.PropsWithChildren<{a: string}>`。

- `React.ReactEventHandler<HTMLXXXELEMENT>`，用来描述元素的事件处理函数。可以自行推导出适合的事件函数描述。

- `React.ChangeEventHandler<HTMLXXXELEMENT>`，最常见的如 input 的 change 事件函数描述，人为的判定类型。区别于上面的，这里的 event 可用 event.target.value，上面的是 event.currentTarget.value。类似还有`MouseEventHandler`, `MouseEventHandler`等。

## 常用的 TS 内建工具泛型和关键字

> 建议先浏览一遍有印象

- `typeof`关键字，自动推断出类型。如`typeof {a: 1, b: 'hello'}` 得到 {a: number, b: string}。

- `keyof`关键字，类似于`Object.keys`。`keyof {a: string, b: string}`得到`'a' | 'b'`。

- `in`关键字，类似于`let k in obj`，遍历。`type Keys = 'a' | 'b', type Obj = {[p in Keys]: any}`，遍历了 Keys，p 相当于 k，得到的 Obj = {a: any, b: any}。

- `Partial<T>`，将 T 类型全部变为可选。如`Partial<{a: stirng, b: number}>` 得到 `{a: string | undefined, b: number | undefined}`。

- `Omit<P, K>`，从 P 中排除 K，返回排除后的结果。如`Omit<{a: string, b: number}, 'a'>` 得到 `{b: number}`。

- `Pick<T, K>`，从 T 中挑选出 K。如`Pick<{a: 1, b: 2, c: 3}, 'a' | 'b'` 得到`{a: 1, b: 2}`。（这里类型值写的是 number 类型的数字，TS 会推断出 number 类型）。

- `Exclude<T, U>`，从类型 T 中排除不在类型 U 中的。如`Exclude<'a' | 'b', 'b' | 'c'>` 得到 `'a'`，如`Exclude<{a: 1, b:2}, {a: 1, b:2, c: 3}>` 得到 `{a: 1, b: 2}`【这里可以这么理解：T 属于 U 的一种具体实现则返回 never，不是则返回 T】。自己实现`type Exc<T, U> = T extends U ? never: T`。

- `Extract<T, U>`，从类型 T 中提取出可以分配给类型 U 的部分。如`Extract<'a' | 'b', 'b' | 'c'>` 得到 `'b'`，如`Extract<{a: 1, b:2}, {a: 1, b:2, c: 3}>` 得到 `never`。【这里可以这么理解：T 属于 U 的一种具体实现，则返回 T，不是则返回 never】。自己实现`type Ext<T, U> = T extends U ? T : never`。

## 非 React 技术栈的常见的 TS 用法

### 类型预测

`is`关键字。常用场景，明确一个对象的类型后，会调用该对象的属性或方法。

```js
function do(str) {
  return str.length // 如果 str 是 number类型，就会报错。
}
```

```js
// 这样写只能在编译阶段，当你传递的参数不是字符串类型而报错提示。
// 如果传入的参数是经过计算或者异步获取，无法保证时，运行时会很大概率报错。
function do(str: string) {
  return str.length
}
```

```js
function do(str: string) {
  if(typeof str === 'string') { // 做好类型判断后编译和运行时都不会报错。但是每次都判断的话，代码变多有点麻烦。
    return str.length
  }
}
```

通常会封装一个判断函数

```js
// 一个判断函数
function isString(val) {
  return typeof val === 'string'
}
function do(str: string){
  // 调用判断函数
  if(isString(str)) {
    return str.length
  }
}
```

```js
// 如果do函数的入参无法确认类型。我们通常会用any。
function do(str: any) { // 这里TS已经忽略了入参类型。
  if(isString(str)) {
    return str.length // 如果无length属性也不会在编译阶段报错，这跟我们使用TS的愿景不一致。
  }
}
```

```js
// 使用类型预测 str is string。
function isString(str: any): str is string {
  return typeof val === 'string'
}
function do(val: any) {
  if(isString(val)) { // 这里在运行时阶段也会判断是否是是string，再决定进入if内的执行代码。
    return str.length // 这里在编译阶段（书写时）会获得string类型对象的所有属性和方法提示。
  }
}
```

> str is string 能否改为: boolean，即 isString 返回的是一个布尔值？不能。改成单一的布尔类型后，无法获得期望的 string 类型对象的属性和方法推断。

## React 常见写法

### 函数组件写法

```js
const FcComp: React.FC<{ prop1: string }> = ({ prop1 }) => {
  return <div>{prop1}</div>
}
```

### 类组件写法

```js
interface IProps {
  name: string;
}
interface IState {
  age: number;
}
class ClsComp extends React.Component<IProps, IState> {
  state = {
    age: 18
  }
}
```

### 默认参数写法

```js
interface IProps extends IDefaultProps {
  name: string;
}
type IDefaultProps = typeof DefComp.defaultProps // 获取到默认属性的type签名
class DefComp extends React.Component<IProps, State> {
  static defaultProps = {
    work: 'docter'
  }

  render() {
    return (
      <div>
        {this.props.name} is {this.props.work}
      </div>
    )
  }
}
```

> 其他写法参照项目中*defaultProps*文件夹

### 通用组件写法

这里描述一个最常见的情景，一个列表组件。利用泛型（阅读入门 TS 泛型部分）实现。

```js
// 组件定义
interface IProps<T> {
  lists: T[]
  renderItem: (item: T) => React.ReactNode // 最好都用ReactNode，而不是JSX.Element。
}
class List<T> extends React.Component<IProps<T>, {}> {
  render() {
    const {lists, renderItem} = this.props
    return (
      <>
        <ul>{lists.map(renderItem)}</ul>
      </>
    )
  }
}

// 调用组件。注意：这里List传入了一个类型number，限制了泛型T的类型。
<List<number> lists={[1, 2, 3]} renderItem={item => <li key={item}>{item}</li>}/>
```

### 高阶组件（HOC）写法

> React 的高阶组件即一个函数，接受一个组件，返回一个新的组件。

这里写一个例子，一个 withState 函数，接收一个没有 count 状态的组件，包装后，返回一个带有 count 状态的组件。

```js
/* withState.tsx */
export interface InjectedProps {
  count: number,
  onIncrement: () => void
}

export const withState = <P extends InjectedProps>(WrappedComp: React.ComponentType<P>) => {
  // 使用Omit结合keyof，实现排除掉IProp和InjectedProps交集的部分(count, onIncrement)
  type HocProps = Omit<IProp, keyof InjectedProps> & {
    // 这里可以做HOC的Props的扩展。
    initialCount?: number
  }
  type HocState = { readonly count: number }

  return class Hoc extends React.Component<HocProps, HocState> {
    // 组件的名字，方便调试
    static displayName = `withState(${WrappedComp.name})`

    state: HocState = {
      count: Number(this.props.initialCount) || 0
    }

    handleInc = () => {
      this.setState({
        count: this.state.count + 1
      })
    }

    render() {
      const { ...restProps } = this.props
      const { count } = this.state
      return (
        <WrappedComp
          count={count}
          onIncrement={this.handleInc}
          // HOC组件，应该透传与HOC无关的Prop给被包裹的组件。这里的写法是因为TS本身的BUG，如果不断言，则类型报错。
          {...(restProps as IProp)}
        ></WrappedComp>
      )
    }
  }
}
```

```js
/* FcCounter.tsx */
export const FcCounter: React.FC<Props> = props => {
  const { label, count, onIncrement } = props
  const handleIncrement = () => {
    onIncrement()
  }
  return (
    <div>
      <span>
        {label}:{count}
      </span>
      <button type="button" onClick={handleIncrement}>{`Increment`}</button>
    </div>
  )
}
```

```js
/* 调用组件 */
import { FcCounter } from './FcCounter'
import { withState } from './withState'

const HocCounterWithState = withState(FcCounter)

<HocCounterWithState initialCount={10} label="HocCounterWithState" />
```

### 默认 props 的写法

```js
// 类组件写法
interface IProps extends defaultProps {
  age: number;
}
// 使用typeof获取到类组件的默认参数类型
type defaultProps = typeof DefaultPropsComp.defaultProps
class DefaultPropsComp extends React.Component<IProps> {
  static defaultProps = {
    name: 'jack'
  }

  echoProps = () => {
    // 这里也可以获得TS提示
    const { age, name } = this.props
  }

  render() {
    return <p>this is how to set default props of class component</p>
  }
}

// 函数组件写法
const defaultProps = {
  work: 'doctor'
}
interface IProps extends defaultPropsType {
  age: number;
}
type defaultPropsType = typeof defaultProps

function DefaultPropsFC(props: IProps) {
  // 这里可以获得提示
  const { work, age } = props

  return <p>{`The ${work} is ${age}`}</p>
}

// 注意：一定要挂载默认属性，否则调用组件的地方默认值也需要传入
DefaultPropsFC.defaultProps = defaultProps
```

### 断言

简单理解为可以 100%确定是什么类型，让 TS 按照确定的类型来进行 TS 提示，推断等。

JSX 中只支持用 `as` 断言写法。不支持**<>**写法，如`var a = <string>b`。跟 jsx 冲突，会当成标签。

```js
type UserA = {
  name: string,
  age: number
}

type UserB = {
  name: string,
  sex: string
}

type IProps = {
  user: UserA | UserB
}

class AssertComp extends React.Component<IProps, {}> {
  render() {
    // 这里如果不做类型断言，会提示UserA上没有sex属性
    // const user = this.props.user
    const userB = this.props.user as UserB
    const userA = this.props.user as UserA
    return <div>
      <p>this is a user: {userA.age}</p>
      <p>this is a user: {userB.sex}</p>
    </div>
  }
}

```

### Context 写法

用 React 官方 DOC 里的更改按钮颜色主题做例子。

```js
/* ctx.tsx */
export type Theme = React.CSSProperties

type Themes = {
  dark: Theme
  light: Theme
}

export const themes: Themes = {
  dark: {
    color: 'black',
    backgroundColor: 'white'
  },
  light: {
    color: 'white',
    backgroundColor: 'black'
  }
}
// 这里定义Context的签名
export type ThemeContextProps = { theme: Theme; toggleTheme?: () => void }

// createContext<T>需要一个类型，把定义好的Context签名传递进去
const ThemeContext = React.createContext<ThemeContextProps>({
  theme: themes.light
})
```

```js
/* themeButton.tsx */
import ThemeContext from './ctx'

// contextType v16.6+支持
export default class ToggleThemeButton extends React.Component<{}> {
  static contextType = ThemeContext

  // 后面需要通过this.context访问到上下文，所以定义一个类属性
  // 这里使用!明确告诉TS，该参数一定有。
  // 这里不能使用？，因为context是必选项
  context!: React.ContextType<typeof ThemeContext>

  render() {
    // 前面context必须这么写，这里才能获取TS提示
    const { theme, toggleTheme } = this.context
    return (
      <button style={theme} onClick={toggleTheme} {...this.props}>
        button
      </button>
    )
  }
}
```

```js
/* provider组件 */
import ThemeContext, { Theme, themes } from './ctx'
import ThemeButton from './themeButton'

export default class ThemeProvider extends React.Component<{}, State> {
  state: State = {
    theme: themes.light
  }

  toggleTheme = () => {
    this.setState(state => ({
      theme: state.theme === themes.light ? themes.dark : themes.light
    }))
  }

  render() {
    const { theme } = this.state
    const { toggleTheme } = this
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ThemeButton />
      </ThemeContext.Provider>
    )
  }
}
```

### 多类型参数（重载）

假设组件接收 2 种类型的 props。可以传`{a: string, config?: number}`，或者`{b: string}`。传递 config 时，说明是用的第一种类型 Props，也一定需要传递 a.

```js
// 定义types
type CommonProps = {
  children: React.ReactNode
  as: 'p' | 'span' | 'h1'
}

type NoTrucateProps = CommonProps & {
  truncate?: false
}

type TrucateProps = CommonProps & {
  truncate: true
  expanded?: boolean
}

// 定义一个类型判断，运行时可用，这里使用了is技巧。
const isTrucateProps = (
  props: TrucateProps | NoTrucateProps
): props is TrucateProps => {
  return !!props.truncate
}

// 这里是关键，函数重载，约定入参和反参。（并不是具体代码实现）调用组件的地方即可获取正确提示。
function Text(props: NoTrucateProps): JSX.Element
function Text(props: TrucateProps): JSX.Element
// 这里才是Text函数的真正实现。
function Text(props: NoTrucateProps | TrucateProps) {
  console.log(props)
  if (isTrucateProps(props)) {
    const { children, as: Tag, truncate, expanded, ...others } = props
    const classNames = truncate ? '.truncate' : ''
    return (
      <Tag className={classNames} aria-expanded={!!expanded} {...others}>
        {children}
      </Tag>
    )
  }

  const { children, as: Tag, ...others } = props
  return <Tag {...others}>{children}</Tag>
}

Text.defaultProps = {
  as: 'p'
}
```

```js
// 调用地
// 这里传递了expanded，但未传入truncate，会获得提示。^_^
<OptionalProps expanded>truncate-able but expanded</OptionalProps>
```

### 零碎，但频率高的 React 用法

包括：**style 样式定义**，**接收 React 节点定义**，**事件函数定义**，**固定可选参数配置**，**类属性定义**，**Ref 定义**。

```js
/* usefulReactProp.tsx */
interface IProps extends DefaultProps {
  descText: string // 基本的类型
  style?: React.CSSProperties // 可以在调用组件的地方，获得style的完美提示。
  additionDom?: React.ReactNode // 接收任何类型的React节点
  renderReactNode?: () => React.ReactNode // 接收一个以函数方式返回的React节点
  onChange: React.FormEventHandler<HTMLInputElement> // 优先推荐这种写法，让TS自己推断。下面的方法定义同样可以。
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  buttonSize: 'small' | 'middle' | 'big' // 可选参数
}

type DefaultProps = typeof UsefulReactProp.defaultProps
interface IState {
  value: string
}

export default class UsefulReactProp extends React.Component<IProps, IState> {
  static defaultProps = {
    initVal: '输入内容'
  }

  // 定义一个dom引用。使用如下定义方式
  static aDom = React.createRef<HTMLDivElement>()

  // 定义一个类属性，可以在需要时在赋值使用
  static classProp?: string

  // 定义一个类属性，在定义时即复制
  static classProp2 = 'hello'

  state = {
    value: this.props.initVal
  }

  defaultOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    this.setState({
      value: e.target.value
    })
    this.classProp = 'hello world'
    onChange(e)
  }

  render() {
    const { onChange, style, additionDom, renderReactNode } = this.props
    const { value } = this.state
    // 如下代码提示只有3种上述定义过的值。
    const btnSize =
      this.props.buttonSize === 'big'
        ? '100px'
        : this.props.buttonSize === 'small'
        ? '60px'
        : '80px;'
    return (
      <div>
        <input type="text" value={value} onChange={this.defaultOnChange} />
        <p className="desc" style={style}>
          这是个带样式的提醒
        </p>
        <div className="additional">{additionDom}</div>
        <div className="by-func-rcnode">
          {renderReactNode ? renderReactNode() : null}
        </div>
        <button style={{ width: btnSize }}>按钮尺寸：联合类型提示</button>
      </div>
    )
  }
}
```

```js
/* 调用 */
// 如下都可以获取类型提示。
<UsefulReactProp
  descText="一个简单的描述"
  onChange={e => {
    console.log(e.currentTarget.value)
  }}
  style={{ fontSize: 14, fontWeight: 'bold' }}
  additionDom={<p>this is additional tag</p>}
  renderReactNode={() => {
    return <p>这是通过函数返回的ReactNode</p>
  }}
  buttonSize="big"
/>
```
