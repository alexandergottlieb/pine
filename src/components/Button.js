import React from 'react'
import '../css/Button.css'
import { Link } from 'react-router-dom'

const Button = props => {

  let { children, type, icon, onClick, link, disabled, title, className } = props

  if (!type) type = "secondary"

  const Tag = link ? Link : "button"
  const style = disabled ? {pointerEvents: "none"} : {}
  
  let iconStyle = {}
  if (children) iconStyle.marginRight = "0.5em"
  const iconSpan = icon ? <span className={`button__icon fas fa-fw ${icon}`} style={iconStyle}></span> : null

  return (
    <Tag className={`button button--${type} ${className}`} onClick={onClick} type="button" to={link} style={style} title={title}>
        {iconSpan}
        {children}
    </Tag>
  )

}

export default Button
