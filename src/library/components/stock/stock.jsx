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

  loadInventory = async (cellar_id, hq_cellar, page) => {
    let store_loader,
      json_data;

    // reset status
    this.setState({ products: null });
    store_loader = new StoreLoader(this.props.accessToken);
    json_data = await store_loader.loadProducts(page, cellar_id);

    this.handleNewStatus(json_data);
    this.props.onPageCountLoaded(Math.ceil(json_data.metadata.count / 100));

    // load current inventory
    if (json_data.replenishments)
      this.loadStoreInventory(cellar_id, hq_cellar, json_data.replenishments);
  }

  loadStoreInventory = (cellar_id, hq_cellar, products) => {

    let skus,
      cellars,
      new_products,
      inventory;

    // early termination
    if (products === undefined) return;

    skus = products.map((item) => {
      return item.sku;
    });
    cellars = cellar_id === hq_cellar ? [cellar_id]:[cellar_id, hq_cellar];

    StockLoader(this.props.accessToken)
    .load(cellars, skus)
    .done((loaded_cellar, products) => {
      if (!this.state.products) return;

      new_products = this.state.products.map((item) => {
        inventory = products.find((element) => {
          return item.sku === element.product_sku;
        });

        if (loaded_cellar === cellar_id) {
          if (item.current_inventory === undefined) {
            item.current_inventory = inventory !== undefined ? inventory.balance_units:undefined;
          }
        }

        if (loaded_cellar === hq_cellar) {
          if (item.hq_inventory === undefined) {
            item.hq_inventory = inventory !== undefined ? inventory.balance_units:undefined;
          }
        }
        return item;
      });

      this.setState({
        products: new_products
      });
    });

  }

  componentDidUpdate = (oldProps) => {
    if (oldProps.selectedCellar !== this.props.selectedCellar
      || oldProps.currentPage !== this.props.currentPage
      || oldProps.loadKey !== this.props.loadKey) {
      this.loadInventory(this.props.selectedCellar, this.props.hqCellar, this.props.currentPage + 1);
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
