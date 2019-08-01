import React, { Component } from 'react'
import Stores from './stores.jsx'
import Stock from './stock.jsx'
import './dashboard.css'

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

  componentDidMount = () => {
    let access_token = window.localStorage.getItem("access_token");
    this.setState({access_token});
  }

  render() {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_title">
          sistema de reposicion de inventario para tiendas
        </div>
        <div className="dashboard_elements">
          <div>
            <div className="subtitle">1. Seleccion de tienda</div>
            <Stores
              access_token={this.state.access_token}
              cellarSelected={this.handleSelectedCellar}
            />
          </div>
          <div>
            <div className="subtitle">2. Pedidos</div>
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
