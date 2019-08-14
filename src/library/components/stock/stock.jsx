import React, { Component } from 'react';

import { StockLoader, StoreLoader } from "../../services";
import { PickerControl } from '..';
import "./stock.css";

// implement stock class
export class Stock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: null,
      error_message: ""
    };
  }

  handleNewStatus = (json_data) => {
    // handle status
    if (json_data.status === "error") {
      this.setState({
        error_message: json_data.message
      });
    }
    else
    {
      this.setState({
        products: json_data.replenishments,
        error_message: ""
      });
    }
  }

  loadInventory = async (cellar_id, page) => {
    let store_loader,
      json_data;

    // reset status
    this.setState({ products: null });
    store_loader = new StoreLoader(this.props.accessToken);
    json_data = await store_loader.loadProducts(page, cellar_id);

    this.handleNewStatus(json_data);

    // load current inventory
    if (json_data.replenishments)
      this.loadStoreInventory(cellar_id, json_data.replenishments);
  }

  loadStoreInventory = (cellar_id, products) => {
    // early termination
    if (products === undefined) return;

    let skus = products.map((item) => {
      return item.sku;
    });

    StockLoader(this.props.accessToken)
    .load([cellar_id], skus)
    .done((cellar_id, products) => {
      if (!this.state.products) return;
      let new_products = this.state.products.map((item, index) => {
        let inventory = products.find((element) => {
          return item.sku === element.product_sku;
        });
        if (item.current_inventory === undefined) {
          item.current_inventory = inventory !== undefined ? inventory.balance_units:undefined;
        }
        return item;
      });

      this.setState({
        products: new_products
      });
    });

  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.selectedCellar !== 0) {
      this.loadInventory(newProps.selectedCellar, newProps.currentPage + 1);
    }
  }

  renderProductList = () => {
    let products;

    if (!this.props.selectedCellar)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Seleccione una bodega</td></tr>);
    }
    else if (this.state.error_message !== "")
    {
      products = (<tr><td colSpan="6" className="stock-message" >{this.state.error_message}</td></tr>);
    }
    else if (!this.state.products)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Cargando...</td></tr>);
    }
    else if (this.state.products.length === 0)
    {
      products = (<tr><td colSpan="6" >No hay productos sugeridos en esta tienda</td></tr>);
    }
    else
    {
      products = this.state.products.map((item, index) => {
        return (
          <tr key={index} >
            <th scope="row">{item.sku}</th>
            <td></td>
            <td></td>
            <td>
              {
                item.current_inventory === undefined ?
                'cargando...':item.current_inventory
              }
            </td>
            <td>{item.suggested}</td>
            <td><PickerControl cellar_id={this.props.selectedCellar} sku={item.sku} ></PickerControl></td>
          </tr>
        );
      });
    }

    return products;
  }

  render() {

    return (
      <section className="stores_wrapper col-12">
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
