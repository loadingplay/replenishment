import React, { Component, Fragment } from 'react'

export default class dashboard extends Component {

  getCodeFromURL = (url) => {
    let code = "";
    url.split("&").forEach((item) => {
      if (~item.indexOf("code")) {
        code = item.split("=")[1];
      }
    });

    return code;
  }

  jsonToQueryString = (json) => {
    return '?' +
      Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(json[key]);
      }).join('&');
  }

  componentDidMount = () => {
    let code = this.getCodeFromURL(document.location.href);

    // get the access token
    const data = {
      "code": code,
      "grant_type": "authorization_code",
      "client_id": "437",
      "client_secret": "2cd6dff49e2715a7be965dda06e101b5",
      "redirect_uri": "http://localhost:8000/code"
    };

    fetch(`https://accounts.loadingplay.com/oauth2/token${this.jsonToQueryString(data)}`)
      .then((response) => response.json())
      .then((json_data) => {

        if (json_data.hasOwnProperty("error")) {
          document.location.href = "/"
          return;
        }

        // persist
        window.localStorage.setItem("access_token", json_data.access_token);
        document.location.href = "/dashboard"
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Fragment>
        <div>Generate access token....</div>
      </Fragment>
    )
  }
}
