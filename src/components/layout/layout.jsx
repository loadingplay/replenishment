import React, { Component } from 'react'
import './layout.css'

export default class layout extends Component {
  render() {
    let { children } = this.props
    return (
      <div className="login_wrapper">
        {children}
      </div>
    )
  }
}
