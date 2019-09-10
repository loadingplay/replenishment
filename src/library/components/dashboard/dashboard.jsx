import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Stock, Stores, DashboardLayout, DashboardControls } from '../../components';

export class Dashboard extends Component {

  propTypes = {
    onInventoryRequest: PropTypes.func,
    accessToken: PropTypes.string,
    products: PropTypes.object,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    stockErrorMessage: PropTypes.string,
    pageCount: PropTypes.number
  };

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
      this.state.current_page + 1,
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
      current_page: e.selected
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
