import React, { Component, Fragment } from 'react'
import Dashboard from '../components/dashboard/dashboard.jsx'
import SEO from '../components/seo/seo.jsx'
export default class dashboard extends Component {
  render() {
    return (
      <Fragment>
        <SEO title="stock management" />
        <Dashboard />
      </Fragment>
    )
  }
}
