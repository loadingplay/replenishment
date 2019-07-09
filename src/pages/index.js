import React, { Component } from 'react'
import { graphql, navigate, Link } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../components/layout/layout.jsx'
import SEO from '../components/seo/seo.jsx'

export default class index extends Component {
  _checkCredentials = e => {
    e.preventDefault()
    navigate(`/dashboard/`)
  }
  render() {
    let {
      data: { logo },
    } = this.props
    return (
      <Layout>
        <SEO />
        <div className="form-module">
          <div className="form">
            <div className="logo">
              <Img
                fixed={logo.childImageSharp.fixed}
                alt="Gatsby Docs are awesome"
              />
              <h2>replenishment</h2>
            </div>

            <form onSubmit={this._checkCredentials}>
              <input type="email" placeholder="email" autoFocus required />
              <input type="password" placeholder="Password" required />
              <button>Login</button>
            </form>
          </div>
          <div className="google_login">
            <button onClick={this._checkCredentials}>
              <span>
                Sign in with <strong>Google</strong>
              </span>
            </button>
          </div>
          <div className="cta">
            <Link to="/dashboard">Forgot your password?</Link>
          </div>
        </div>
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
