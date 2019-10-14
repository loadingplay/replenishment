import React, { Component } from 'react';
import { StockLoader, StoreLoader } from "../library/services";
import { Dashboard } from "../library/components/dashboard";

export default class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: "",
      page_count: 0,
      products: null,
      is_loading: false,
      has_error: false,
      stock_error_message: ""
    };
  }

  componentDidMount = () => {
    let access_token = window.localStorage.getItem("access_token");
    this.setState({ access_token });
  }

  setLoadingState = () => {
    this.setState({
      is_loading: true,
      has_error: false,
      stock_error_message: ""
    });
  }

  handleLoadedState = (json_data) => {
    // handle status
    if (json_data.status === "error") {
      this.setState({
        stock_error_message: json_data.message,
        is_loading: false,
        has_error: true
      });

      return false;
    } else {
      this.setState({
        products: json_data.replenishments,
        is_loading: false,
        has_error: false,
        stock_error_message: ""
      });

      return true;
    }
  }

  handlePageCountLoaded = (page_count) => {
    this.setState({
      page_count
    });
  }

  handleInventoryRequest = async (hq_cellar_id, selected_cellar_id, page, search_term) => {
    let store_loader,
    json_data;

    this.setLoadingState();

    store_loader = new StoreLoader(this.state.access_token);
    json_data = await store_loader.loadProducts(page, selected_cellar_id, search_term);

    if (!this.handleLoadedState(json_data)) return;  // handle errors
    this.handlePageCountLoaded(Math.ceil(json_data.metadata.count / 100));

    // load current inventory
    if (json_data.replenishments)
      this.loadStoreInventory(hq_cellar_id, selected_cellar_id, json_data.replenishments);
  }


  loadStoreInventory = (hq_cellar_id, selected_cellar_id, products) => {

    let skus,
      cellars,
      new_products,
      inventory;

    // early termination
    if (products === undefined) return;

    skus = products.map((item) => {
      return item.sku;
    });
    cellars = selected_cellar_id === hq_cellar_id ? [selected_cellar_id] : [selected_cellar_id, hq_cellar_id];

    StockLoader(this.state.access_token)
      .load(cellars, skus)
      .done((loaded_cellar, products) => {
        if (!this.state.products) return;

        new_products = this.state.products.map((item) => {
          inventory = products.find((element) => {
            return item.sku === element.product_sku;
          });

          if (loaded_cellar === selected_cellar_id) {
            if (item.current_inventory === undefined) {
              item.current_inventory = inventory !== undefined ? inventory.balance_units : undefined;
            }
          }

          if (loaded_cellar === hq_cellar_id) {
            if (item.hq_inventory === undefined) {
              item.hq_inventory = inventory !== undefined ? inventory.balance_units : undefined;
            }
          }
          return item;
        });

        this.setState({ products: new_products });
      });
  }

  render = () => {
    return (
      <Dashboard
        accessToken={this.state.access_token}
        onInventoryRequest={this.handleInventoryRequest}
        pageCount={this.state.page_count}

        products={this.state.products}
        isLoading={this.state.is_loading}
        hasError={this.state.has_error}
        stockErrorMessage={this.state.stock_error_message}

        {...this.props}
      ></Dashboard>
    );
  }
}
