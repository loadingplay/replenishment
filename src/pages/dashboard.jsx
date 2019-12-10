import React, { Component } from 'react';
import { StockLoader, StoreLoader } from "../library/services";
import { PickerStore } from '../library/services';
import { DashboardWithScanner } from "../library/components/dashboard";

export default class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: "",
      page_count: 0,
      extra_products: null,
      products: null,
      is_loading: false,
      has_error: false,
      stock_error_message: "",
      load_key: 1,
      is_scanner_loading: 0
    };
  }

  componentDidMount = () => {
    let access_token = window.localStorage.getItem("access_token");
    this.setState({ access_token });

    if (typeof window !== 'undefined') {
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1607292,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
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

  handleInventoryRequest = async (hq_cellar_id, selected_cellar_id, page, search_term, search_type) => {
    let store_loader,
    json_data;

    this.setState({ extra_products: PickerStore.getAllExtras(selected_cellar_id) });
    this.setLoadingState();

    store_loader = new StoreLoader(this.state.access_token);
    json_data = await store_loader.loadProducts(page, selected_cellar_id, search_term, search_type);

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

  addNewSKU = async (selected_cellar_id, barcode) => {
    // create product structure
    let product = { sku: barcode, name: "test", barcode: barcode, is_extra: true };
    // find product in api
    let response = await fetch(
      `https://apibodegas.loadingplay.com/v1/product/${barcode}`,
      {
        headers: {
          "Authorization": `Bearer ${this.state.access_token}`
        }
      }
    );
    let json_data = await response.json();

    if (response.status === 200 && json_data.status !== "error") {
      product.sku = json_data.product.sku
    }

    // agregar +1 en picker
    PickerStore.set(
      selected_cellar_id,
      product.sku,
      PickerStore.get(selected_cellar_id, product.sku) + 1,
      0, 0, 0, true, product
    );
  }

  handleScannerRead = async (hq_cellar_id, selected_cellar_id, input_string) => {
    let store_loader, json_data, product, cellars, q, inventories = {}, to;

    this.setState({ is_scanner_loading: this.state.is_scanner_loading + 1 });

    // search product
    store_loader = new StoreLoader(this.state.access_token);
    json_data = await store_loader.loadProducts(1, selected_cellar_id, input_string);
    if (!json_data.replenishments || json_data.replenishments.length === 0) {
      await this.addNewSKU(selected_cellar_id, input_string);
      this.setState({
        is_scanner_loading: this.state.is_scanner_loading - 1,
        extra_products: PickerStore.getAllExtras(selected_cellar_id),
        load_key: this.state.load_key + 1
      });
      return;
    }

    product = json_data.replenishments[0];
    cellars = selected_cellar_id === hq_cellar_id ? [selected_cellar_id] : [selected_cellar_id, hq_cellar_id];

    StockLoader(this.state.access_token)
    .load(cellars, [product.sku])
    .done((cellar_id, products) => {
      inventories[cellar_id] = products[0].balance_units;

      if (Object.keys(inventories).length === cellars.length)
      {
        q = PickerStore.get(selected_cellar_id, product.sku);
        PickerStore.set(
          selected_cellar_id,
          product.sku,
          q + 1,
          inventories[hq_cellar_id],
          inventories[selected_cellar_id],
          product.suggested
        );
        clearTimeout(to);
        this.setState({ load_key: this.state.load_key + 1, is_scanner_loading: this.state.is_scanner_loading - 1 });
      }
    });
  }

  handlePickerClear = () => {
    this.setState({ load_key: this.state.load_key + 1 });
  }

  render = () => {
    return (
      <DashboardWithScanner
        loadKey={this.state.load_key}
        accessToken={this.state.access_token}
        onInventoryRequest={this.handleInventoryRequest}
        pageCount={this.state.page_count}

        isScannerLoading={this.state.is_scanner_loading}
        onScannerRead={this.handleScannerRead}
        onPickerClear={this.handlePickerClear}

        extraProducts={this.state.extra_products}
        products={this.state.products}
        isLoading={this.state.is_loading}
        hasError={this.state.has_error}
        stockErrorMessage={this.state.stock_error_message}

        {...this.props}
      ></DashboardWithScanner>
    );
  }
}
