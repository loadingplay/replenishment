import React from 'react'


export class LogoutButton extends React.Component {
  handleLogout = () => {
    // remove cookie and go to login
    document.location.href = "https://accounts.loadingplay.com/auth/logout?next=http://localhost:8000"
  }

  render = () => {
    return (<a type="button" onClick={this.handleLogout} className="float-right" >Salir</a>);
  }
}
