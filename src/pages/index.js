import React, { Component } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout.jsx'
import SEO from '../components/seo/seo.jsx'
import Login from './Login'
import authService from '../services/authService';
import { navigate } from '@reach/router';

const index = (props) => {

    if (authService.isLoggedIn()) {
      navigate(`/dashboard`)
      return null
    }

    return (
      <Layout>
        <SEO />
        <Login {...props}/>
      </Layout>
    )
}

export default index;

export const siteData = graphql`
  query {
    logo: file(relativePath: { eq: "inventory.png" }) {
      childImageSharp {
        fixed(width: 64, height: 64) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
