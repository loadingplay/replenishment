import React, { Component } from 'react'
import { navigate } from 'gatsby'
import loginService from '../services/loginService'

export default class code extends Component {

    componentDidMount(){
        let params = this.props.location.href.split("?")[1].split("&");
        let code = params[1].match(/code=(.*)/)[1];
        
        let objToken = {
            code: code,
            grant_type: "authorization_code",
            client_id: parseInt(process.env.CLIENT_ID),
            client_secret: process.env.SECRET,
            redirect_uri: process.env.REDIRECT_URI
        }

        loginService.getToken(objToken).then((data) => {
            let token = data.access_token
            loginService.getUser(token).then((data) => {
                console.log(data);
                navigate(`/dashboard/`)
            })
        });
    }

    render() {

        return (
            <div>
                <h1>GENERANDO CODIGO</h1>
            </div>
        )
    }
}
