import React, { Component } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout.jsx'
import SEO from '../components/seo/seo.jsx'
import Login from './Login'

export default class index extends Component {


  render() {
    return (
      <Layout>
        <SEO />
        <Login {...this.props}/>
      </Layout>
    )
  }
}

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
