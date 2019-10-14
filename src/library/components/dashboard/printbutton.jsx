import React from "react";


export class PrintButton extends React.Component {

  render = () => {
    return (
      <a className="btn btn-warning ml-1" role="button" href="/print" target="_blank" >
        Imprimir
      </a>
    );
  }
}
