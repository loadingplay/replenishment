import React from 'react'


export class LogoutButton extends React.PureComponent {

  render = () => {
    return (
      <a
        href={`https://accounts.loadingplay.com/auth/logout?next=${process.env.PROJECT_URL}`}
        role="button"
        className="btn btn-link ml-1" >
        Salir
      </a>
    );
  }
}
