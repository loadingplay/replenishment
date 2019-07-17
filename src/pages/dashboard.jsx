import React, { Component, Fragment } from 'react'
import Dashboard from '../components/dashboard/dashboard.jsx'
import SEO from '../components/seo/seo.jsx'
import authService from '../services/authService';
import { navigate } from '@reach/router';

const dashboard = (props) => {

    if (!authService.isLoggedIn()) {
      navigate(`/`)
    }

    return (
      <Fragment>
        <SEO title="stock management" />
        <Dashboard />
      </Fragment>
    )
}

export default dashboard;
