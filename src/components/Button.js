import React from 'react'
import '../css/Button.css'
import { Link } from 'react-router-dom'

const Button = props => {

  let { children, type, icon, onClick, link, disabled, title, className } = props

  if (children) children = <span>{children}</span>

  if (!type) type = "secondary"

  const Tag = link ? Link : "button"
  const iconSpan = icon ? <span className={`button__icon fas fa-fw ${icon}`}></span> : null
  const style = disabled ? {pointerEvents: "none"} : {}

  return (
    <Tag className={`button button--${type} ${className}`} onClick={onClick} type="button" to={link} style={style} title={title}>
        {iconSpan}
        {children}
    </Tag>
  )

}

export default Button
