import React, { PureComponent } from 'react'
import PropTypes from "prop-types";

export default class Layout extends PureComponent {

  static propTypes = {
    children: PropTypes.any
  }

  render() {
    let { children } = this.props
    return (
      <div className="login_wrapper">
        {children}
      </div>
    )
  }
}
