import React, { Component } from 'react'
import './stores.css'
import authService from '../../services/authService';

export default class stock extends Component {
  render() {
    return (
      <section className="stores_wrapper">
        <table className="table table-hover table-borderless">
          <thead>
            <tr className="table-info">
              <th scope="col">sku</th>
              <th scope="col">nombre producto</th>
              <th scope="col">stock en bodega</th>
              <th scope="col">stock en tienda</th>
              <th scope="col">sugerido</th>
              <th scope="col">picker</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">sku1</th>
              <td>producto 1</td>
              <td>10</td>
              <td>5</td>
              <td></td>
              <td>picker</td>
            </tr>
            <tr>
              <th scope="row">sku2</th>
              <td>producto 1</td>
              <td>10</td>
              <td>5</td>
              <td></td>
              <td>picker</td>
            </tr>
          </tbody>
        </table>
        <section className="search_actions">
          <div>
            <input type="text" placeholder="ingrese sku" />
          </div>
          <div className="list_btn">
            <div>
              <button type="button" className="btn btn-success">
                imprimir
              </button>
            </div>
            <div>
              <button type="button" className="btn btn-primary">
                generar guia de despacho
              </button>
            </div>
            <div>
              <button type="button" className="btn btn-danger" onClick={authService.logout}>
                cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </section>
    )
  }
}
