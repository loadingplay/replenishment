import React, { Component } from 'react'
import './stores.css'
import { Link } from 'gatsby'

export default class stores extends Component {
  render() {
    return (
      <section className="stores_wrapper">
        <table className="table table-hover table-borderless">
          <thead>
            <tr className="table-info">
              <th scope="col">tiendas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>tienda 1</td>
            </tr>
            <tr>
              <td>tienda 2</td>
            </tr>
            <tr>
              <td>tienda 3</td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }
}
