import React from 'react'
import FC from './fcCom/index'
import SomeHook from './rcHook/index'
import ClassCom from './classCom/index'
import DefaultPropsComp from './defaultProps/index_class'
import DefaultPropsFcComp from './defaultProps/index_fun'
import DefaultPropsOther from './defaultProps/other_write'
import UsefulReactProp from './UsefulReactProp/index'
import AssertComp from './assert/index'
import IntersectionComp from './intersectionType/index'
import List from './genericComp/index'
import IfChild from './genericComp/ifChild'
import DiffProps from './diffProps/index'
import OptionalProps from './optionalProps/index'
import { FcCounter } from './Hoc/comp'
import { withState } from './Hoc/index'
import RcContext from './rcContext/provider'
import './testPath/index'

const HocCounterWithState = withState(FcCounter)

function App() {
  return (
    <div className="App">
      <FC name="this is a FC" />
      <SomeHook />
      <ClassCom message="this is a class comp" />
      <DefaultPropsComp age={12} />
      <DefaultPropsFcComp age={30} />
      <DefaultPropsOther label="hello" />
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
      <AssertComp user={{ name: 'Jack', age: 12 }} />
      <IntersectionComp
        dog={{ name: 'dog', tailsCount: 4 }}
        human={{ name: 'human', handsCount: 4 }}
      />
      {/* 这里可以要求List类型 */}
      <List<number>
        list={[1, 2, 3]}
        renderItem={item => {
          return <li key={item}>this is {item}</li>
        }}
      ></List>
      <IfChild
        something="this is something"
        renderItem={item => <p>通过p标签渲染：{item}</p>}
      >
        this is children
      </IfChild>
      {/* 通过传入不同的props让组件进行不同的渲染 */}
      <DiffProps href="http://www.baidu.com" />
      <DiffProps />
      <div>
        <OptionalProps>not truncated</OptionalProps>
        <OptionalProps truncate>truncated</OptionalProps>
        <OptionalProps truncate expanded>
          truncate-able but expanded
        </OptionalProps>
        <OptionalProps expanded truncate>
          truncate-able but expanded
        </OptionalProps>
      </div>
      <HocCounterWithState initialCount={10} label="HocCounterWithState" />
      <RcContext>a button</RcContext>
    </div>
  )
}

export default App
