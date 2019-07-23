import React, { Component , useState  } from 'react'
import Stores from './stores.jsx'
import Stock from './stock.jsx'
import './dashboard.css'

const dashboard = (props) =>  {

    const [cellarId, setCellarId] = useState(0);

    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_title">
          sistema de reposicion de inventario para tiendas
        </div>
        <div className="dashboard_elements">
          <div>
            <div className="subtitle">1. Seleccion de tienda</div>
            <Stores  cellarId={cellarId} setCellarId={setCellarId}/>
          </div>
          <div>
            <div className="subtitle">2. Pedidos</div>
            <Stock cellarId={cellarId} setCellarId={setCellarId}/>
          </div>
        </div>
      </div>
    )
}

export default dashboard;
