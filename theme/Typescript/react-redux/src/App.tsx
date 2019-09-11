import React from 'react';
import FC from './fcCom/index'
import SomeHook from './rcHook/index'
import ClassCom from './classCom/index'
import DefaultPropsComp from './defaultProps/index_class'
import DefaultPropsFcComp from './defaultProps/index_fun'
import UsefulReactProp from './UsefulReactProp/index'
import AssertComp from './assert/index'
import IntersectionComp from './intersectionType/index'

function App() {


  return (
    <div className="App">
      <FC name="this is a FC"/>
      <SomeHook />
      <ClassCom message="this is a class comp"/>
      <DefaultPropsComp age={12} />
      <DefaultPropsFcComp age={30}/>
      <UsefulReactProp descText="一个简单的描述" onChange={e => {
        console.log(e.currentTarget.value)
      }} style={{fontSize: 14, fontWeight: 'bold'}} additionDom={<p>this is additional tag</p>} renderReactNode={() => {return <p>这是通过函数返回的ReactNode</p>}} buttonSize="big"/>
      <AssertComp user={{name: 'Jack', age: 12}}/>
      <IntersectionComp dog={{name: 'dog', tailsCount: 4}} human={{name: 'human', handsCount: 4}}/>
    </div>
  );
}

export default App;
