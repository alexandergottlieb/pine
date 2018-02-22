import React from 'react'
import '../css/Button.css'
import { Link } from 'react-router-dom'

const Button = props => {

  let { children, type, icon, onClick, link } = props

  if (children) children = <span>{children}</span>

  const Tag = link ? Link : "button"
  const iconSpan = icon ? <span className={`button__icon fa ${icon}`}></span> : null

  return (
    <Tag className={`button button--${type}`} onClick={onClick} type="button" to={link}>
        {iconSpan}
        {children}
    </Tag>
  )

}

export default Button
