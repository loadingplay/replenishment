import React, { Component } from 'react'
import Img from 'gatsby-image'

export default class index extends Component {

    _goToLogin = e => {
        e.preventDefault()
        window.location =`https://accounts.loadingplay.com/oauth2/auth?redirect_uri=${process.env.REDIRECT_URI}/code&site_name=${process.env.SITE_NAME}&client_id=${process.env.CLIENT_ID}&response_type=code`;
    }   
    
  render() {
    let {
      data: { logo },
    } = this.props

    
    return (
        <div className="form-module">
          <div className="form">
            <div className="logo">
              <Img
                fixed={logo.childImageSharp.fixed}
                alt="Gatsby Docs are awesome"
              />
              <h2>Replenishment System</h2>
            </div>

            <form onSubmit={this._goToLogin}>
              <button type="submit">Ingresar</button>
            </form>
          </div>

        </div>
    )
  }
}