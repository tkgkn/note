import React, {useState} from 'react'

// 使用useState的地方，TS可以根据默认值推导出 count 是 number类型，因此不允许通过setCount设置其他类型以外的值

// 可以明确count的类型，支持string | number，不用TS推导

const SomeHook: React.FC = () => {
  const [count, setCount] = useState<string | number>(0)

  return <div>
    <p>this is someHook's value, the value is {count}</p>
    <button onClick={() => setCount('a string or number')}>change</button>
  </div>
}

export default SomeHook