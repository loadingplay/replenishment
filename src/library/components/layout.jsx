import React, { PureComponent } from 'react'

export default class Layout extends PureComponent {
  render() {
    let { children } = this.props
    return (
      <div className="login_wrapper">
        {children}
      </div>
    )
  }
}
