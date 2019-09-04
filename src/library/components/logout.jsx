import React from 'react'


export class LogoutButton extends React.Component {

  render = () => {
    return (
      <a
        href={`https://accounts.loadingplay.com/auth/logout?next=${process.env.PROJECT_URL}`}
        className="float-right" >
        Salir
      </a>
    );
  }
}
