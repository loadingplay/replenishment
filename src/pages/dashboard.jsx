import React, { Component } from 'react';
import PropTypes from "prop-types";

import ReactPaginate from 'react-paginate';

import { PickerClearButton, LogoutButton, Stock, Stores, SearchInput } from '../library/components';
import { GenerateOrderButton } from '../library/components/order';

import { StockLoader, StoreLoader } from "../library/services";

class DashboardLayout extends Component {

  static propTypes = {
    title: PropTypes.string,

    menuTitle: PropTypes.string,
    menu: PropTypes.object,

    tableTitle: PropTypes.string,
    table: PropTypes.object,
    tableControls: PropTypes.object
  }

  render = () => {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_elements row">
          <h3 className="dashboard_title col-12">
            {this.props.title}
          </h3>

          {/* Stores */}
          <div className="col-2" >
            <div className="subtitle">{this.props.menuTitle}</div>
            {this.props.menu}
          </div>

          {/* Inventory table */}
          <div className="col-10 row" >
            <div className="subtitle col-6">
              {this.props.tableTitle}
            </div>
            <div className="col-6">
              <LogoutButton></LogoutButton>
            </div>
            {this.props.table}

            {/* Controls */}
            <section className="controls col-12 row">
              {this.props.tableControls}
            </section>
          </div>
        </div>
      </div>
    )
  }
}

class DashboardControls extends Component {

  static propTypes = {
    pageCount: PropTypes.number,
    currentPage: PropTypes.number,
    selectedCellarID: PropTypes.number,
    accessToken: PropTypes.string,

    onPageChange: PropTypes.func,
    onSearchTermChange: PropTypes.func,
    onPickerCleared: PropTypes.func
  }

  render = () => {
    return (
      <React.Fragment>
        <div className="col-12" >
          <ReactPaginate
            previousLabel={'anterior'}
            nextLabel={'siguiente'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={this.props.pageCount}
            forcePage={this.props.currentPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.props.onPageChange}
            containerClassName={'pagination'}

            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"

            pageClassName="page-item"
            pageLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"

            activeClassName={'active'}
          />
        </div>
        <div className="col-4" >
          <SearchInput
            onSearch={this.props.onSearchTermChange}
          ></SearchInput>
        </div>
        <div className="col-4 offset-md-4 row">
          <PickerClearButton
            selected_cellar_id={this.props.selectedCellarID}
            onPickerClear={this.props.onPickerCleared}
          ></PickerClearButton>
          <a type="button" className="btn btn-success btn-block float-right" href="/print" target="_blank" >
            imprimir
          </a>
          <GenerateOrderButton
            selectedCellar={this.props.selectedCellarID}
            accessToken={this.props.accessToken}
            onOrderGenerated={this.props.onPickerCleared}
          ></GenerateOrderButton>
        </div>
      </React.Fragment>
    );
  }
}


function withInventoryLoader(WrappedComponent) {
  return class extends Component {
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
      }
      else {
        this.setState({
          products: json_data.replenishments,
          is_loading: false,
          has_error: false,
          stock_error_message: ""
        });
      }
    }

    handlePageCountLoaded = (page_count) => {
      this.setState({
        page_count
      });
    }

    handleInventoryRequest = async (hq_cellar_id, selected_cellar_id, page, search_term) => {
      console.log("inventory reload", hq_cellar_id, selected_cellar_id, page, search_term);

      let store_loader,
      json_data;

      this.setLoadingState();

      store_loader = new StoreLoader(this.state.access_token);
      json_data = await store_loader.loadProducts(page, selected_cellar_id, search_term);

      this.handleLoadedState(json_data);
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
        <WrappedComponent
          accessToken={this.state.access_token}
          onInventoryRequest={this.handleInventoryRequest}
          pageCount={this.state.page_count}

          products={this.state.products}
          isLoading={this.state.is_loading}
          hasError={this.state.has_error}
          stockErrorMessage={this.state.stock_error_message}

          {...this.props}
        ></WrappedComponent>
      );
    }
  }
}

class dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected_cellar_id: 0,
      current_page: 0,
      load_key: 1,
      search_term: ""
    };
  }

  reloadInventory = () => {
    // reset status
    this.props.onInventoryRequest(
      this.state.hq_cellar_id,
      this.state.selected_cellar_id,
      this.state.current_page,
      this.state.search_term
    );
  }

  handleSelectedCellar = (cellar_id) => {
    this.setState({
      selected_cellar_id: cellar_id
    }, () => {
      this.reloadInventory();
    });
  }

  handlePageClick = (e) => {
    this.setState({
      current_page: e.selected + 1
    }, () => {
      this.reloadInventory();
    });
  }

  handleHQCellar = (hq_cellar_id) => {
    this.setState({
      hq_cellar_id: hq_cellar_id
    });
  }

  handleSearch = (search_term) => {
    this.setState({
      search_term
    }, () => {
      this.reloadInventory();
    });
  }

  handlePickerClear = () => {
    this.setState({
      load_key: this.state.load_key + 1
    });
  }

  render() {
    return (
      <DashboardLayout
        title="Reposición de inventario."

        menuTitle="1. Seleccion de tienda"
        menu={
          <Stores
            accessToken={this.props.accessToken}
            cellarSelected={this.handleSelectedCellar}
            onHQCellarLoaded={this.handleHQCellar}
          />
        }

        tableTitle="2. Pedidos"
        table={
          <Stock
            loadKey={this.state.load_key}
            selectedCellar={this.state.selected_cellar_id}

            products={this.props.products}
            isLoading={this.props.isLoading}
            hasError={this.props.hasError}
            errorMessage={this.props.stockErrorMessage}
          />
        }
        tableControls={
          <DashboardControls
            pageCount={this.props.pageCount}
            currentPage={this.state.current_page}
            selectedCellarID={this.state.selected_cellar_id}
            accessToken={this.props.accessToken}

            onPageChange={this.handlePageClick}
            onSearchTermChange={this.handleSearch}
            onPickerCleared={this.handlePickerClear}
          ></DashboardControls>
        }
      ></DashboardLayout>
    );
  }
}

export default withInventoryLoader(dashboard);
