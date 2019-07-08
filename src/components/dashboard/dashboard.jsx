import React, { Component } from 'react'
import Stores from './stores.jsx'
import Stock from './stock.jsx'
import './dashboard.css'

export default class dashboard extends Component {
  render() {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_title">
          sistema de reposicion de inventario para tiendas
        </div>
        <div className="dashboard_elements">
          <div>
            <div className="subtitle">1. Seleccion de tienda</div>
            <Stores />
          </div>
          <div>
            <div className="subtitle">2. Pedidos</div>
            <Stock />
          </div>
        </div>
      </div>
    )
  }
}
