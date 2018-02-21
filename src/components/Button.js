import React from 'react'
import '../css/Button.css'

const Button = props => {

  let { children, primary } = props

  return (
    <button className={`button button--${primary ? 'primary' : 'secondary'}`} type="button">
      {children}
    </button>
  )

}

export default Button
