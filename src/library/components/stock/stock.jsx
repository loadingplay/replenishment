import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PickerControl } from '..';
import "./stock.css";

// implement stock class
export class Stock extends Component {

  static propTypes = {
    selectedCellar: PropTypes.number,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
    products: PropTypes.array,
    loadKey: PropTypes.number
  };

  renderProductList = () => {
    let products;

    if (this.props.selectedCellar === 0)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Seleccione una tienda</td></tr>);
    }
    else if (this.props.hasError)
    {
      products = (<tr><td colSpan="6" className="stock-message" >{this.props.errorMessage}</td></tr>);
    }
    else if (this.props.isLoading)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Cargando...</td></tr>);
    }
    else if (this.props.products && this.props.products.length === 0)
    {
      products = (<tr><td colSpan="6" >No hay productos sugeridos en esta tienda</td></tr>);
    }
    else if (this.props.products)
    {
      products = this.props.products.map((item, index) => {
        return (
          <tr key={index} >
            <th scope="row">{item.sku}</th>
            <td></td>
            <td>
              {
                item.hq_inventory === undefined ?
                'cargando...':item.hq_inventory
              }
            </td>
            <td>
              {
                item.current_inventory === undefined ?
                'cargando...':item.current_inventory
              }
            </td>
            <td>{item.suggested}</td>
            <td>
              <PickerControl
                key={this.props.loadKey}
                cellar_id={this.props.selectedCellar}
                item={item}
              >
              </PickerControl>
            </td>
          </tr>
        );
      });
    }

    return products;
  }

  render() {

    return (
      <section className="stores_wrapper">
        <table className="table table-sm">
          <thead>
            <tr className="table-info">
              <th scope="col">sku</th>
              <th scope="col">nombre</th>
              <th scope="col">stock bodega</th>
              <th scope="col">stock tienda</th>
              <th scope="col">sugerido</th>
              <th scope="col">picker</th>
            </tr>
          </thead>
          <tbody>
            { this.renderProductList() }
          </tbody>
        </table>
      </section>
    )
  }
}
