import React, { Component } from 'react'
import Stores from './stores.jsx'
import Stock from './stock.jsx'

export default class dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "access_token": "",
      "selected_cellar_id": 0
    };
  }

  handleSelectedCellar = (cellar_id) => {
    this.setState({
      "selected_cellar_id": cellar_id
    });
  }

  handleLogout = () => {
    // remove cookie and go to login
    document.location.href = "https://accounts.loadingplay.com/auth/logout?next=http://localhost:8000"
  }

  componentDidMount = () => {
    let access_token = window.localStorage.getItem("access_token");
    this.setState({access_token});
  }

  render() {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_elements row">
          <h3 className="dashboard_title col-12">
            Reposición de inventario.
          </h3>
          <div className="col-2" >
            <div className="subtitle">1. Seleccion de tienda</div>
            <Stores
              access_token={this.state.access_token}
              cellarSelected={this.handleSelectedCellar}
            />
          </div>
          <div className="col-10 row" >
            <div className="subtitle col-6">
              2. Pedidos
            </div>
            <div className="col-6">
              <a type="button" onClick={this.handleLogout} className="float-right" >Salir</a>
            </div>
            <Stock
              selected_cellar={this.state.selected_cellar_id}
              access_token={this.state.access_token}
            />
          </div>
        </div>
      </div>
    )
  }
}
