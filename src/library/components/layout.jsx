import React, { PureComponent } from 'react'
import PropTypes from "prop-types";

export default class Layout extends PureComponent {

  propTypes = {
    children: PropTypes.object
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
