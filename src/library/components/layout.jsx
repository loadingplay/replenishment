import React, { Component } from 'react'

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