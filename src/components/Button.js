import React from 'react'
import '../css/Button.css'

const Button = props => {

  let { children, type, icon, onClick } = props

  if (children) children = <span>{children}</span>

  return (
    <button className={`button button--${type}`} onClick={onClick} type="button">
      <span className={`button__icon fa ${icon}`}></span>
      {children}
    </button>
  )

}

export default Button
