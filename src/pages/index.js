import React, { Component } from 'react'
import { graphql, navigate } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../library/components/layout';

export default class index extends Component {
  _checkCredentials = e => {
    e.preventDefault()
    navigate(`/dashboard/`)
  }

  handleLoginClick = () => {
    document.location.href = "https://accounts.loadingplay.com/oauth2/auth?" +
      "redirect_uri=" + process.env.PROJECT_URL + "/code&" +
      "site_name=replenishment-local&" +
      "client_id=437&" +
      "response_type=code";
  }

  render() {
    let {
      data: { logo },
    } = this.props
    return (
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <div className="logo">
              <Img
                fixed={logo.childImageSharp.fixed}
                alt="Gatsby Docs are awesome"
              />
              <h2>replenishment</h2>
            </div>

            <button onClick={this.handleLoginClick} >Login</button>
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
