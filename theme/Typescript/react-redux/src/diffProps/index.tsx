import React from 'react'

/* 方式1：定义2种不同的完整类型，通过差异prop判断 */
// 相当于 React.ClassAttributes<HTMLButtonElement> & React.ButtonHTMLAttributes<HTMLButtonElement>
type ButtonProps = JSX.IntrinsicElements['button']
type AnchorProps = JSX.IntrinsicElements['a']

function isPropsForAnchorElement(
  props: ButtonProps | AnchorProps
): props is AnchorProps {
  return 'href' in props
}

function DiffProps(props: ButtonProps | AnchorProps) {
  if (isPropsForAnchorElement(props)) {
    return <a {...props}>a link</a>
  } else {
    return <button {...props}>button</button>
  }
}

/* 方式2：无需完整定义2种不同props，通过omit，排除掉差异性的prop */
// type AnchorProps = JSX.IntrinsicElements['a']
// type LinkProps = Omit<AnchorProps, 'href'> & { to: string } // 排除掉href，组合to

// function DiffProps(props: AnchorProps | LinkProps) {
//   if ('to' in props) {
//     return <a {...props}>link a</a>
//   } else {
//     return <a {...props}>link a without to</a>
//   }
// }

export default DiffProps
