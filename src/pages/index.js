import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { PropTypes } from "prop-types";
import Layout from '../library/components/layout';

export default class index extends Component {

  static propTypes = {
    data: PropTypes.object
  };

  _checkCredentials = (e) => {
    e.preventDefault()
    navigate(`/dashboard/`)
  }

  handleLoginClick = () => {
    let access_token = localStorage.getItem("access_token");

    if (access_token && access_token != "") {
      document.location.href = "/dashboard";
      return
    }

    document.location.href = "https://accounts.loadingplay.com/oauth2/auth?" +
      "redirect_uri=" + process.env.PROJECT_URL + "/code&" +
      "site_name=replenishment-local&" +
      "client_id=437&" +
      "response_type=code";
  }

  render() {
    return (
      <Layout>
        <div className="container" >
          <div className="row">
            <div className="col-md-12">
              <div className="logo">
                <h2>Reposiciones.</h2>
              </div>

              <button onClick={this.handleLoginClick} >Ingresar</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
