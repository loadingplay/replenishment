import React from 'react'


export class LogoutButton extends React.PureComponent {

  handleClick = () => {
    localStorage.setItem("access_token", "");
    document.location.href = `https://accounts.loadingplay.com/auth/logout?next=${process.env.PROJECT_URL}`;
  }

  render = () => {
    return (
      <button
        onClick={this.handleClick}
        role="button"
        className="btn btn-link ml-1" >
        Salir
      </button>
    );
  }
}
