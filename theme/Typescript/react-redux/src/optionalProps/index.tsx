import React from 'react'

// 仅允许在某个prop A已经传递的情况下，可以选择性的传递一个prop B。 如未传入A，不允许传入B。

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

const isTrucateProps = (
  props: NoTrucateProps | TrucateProps
): props is TrucateProps => !!props.truncate

function Text(props: NoTrucateProps | TrucateProps) {
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

export default Text
