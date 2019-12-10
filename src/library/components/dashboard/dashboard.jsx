import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import { Stock, Stores, DashboardLayout, DashboardControls } from '../../components';
import { withBarcodeScanner } from "./barcodescanner";


export class Dashboard extends React.Component {

  static propTypes = {
    onInventoryRequest: PropTypes.func,
    accessToken: PropTypes.string,
    extraProducts: PropTypes.array,
    products: PropTypes.array,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    stockErrorMessage: PropTypes.string,
    pageCount: PropTypes.number,
    onScannerRead: PropTypes.func,
    onPickerClear: PropTypes.func,
    loadKey: PropTypes.number,
    isScannerLoading: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      selected_cellar_id: 0,
      selected_cellar_name: "",
      current_page: 0,
      search_term: "",
      search_type: 'search'
    };
  }

  reloadInventory = async () => {
    // reset status
    await this.props.onInventoryRequest(
      this.state.hq_cellar_id,
      this.state.selected_cellar_id,
      this.state.current_page + 1,
      this.state.search_term,
      this.state.search_type
    );
  }

  handleSelectedCellar = (cellar_id, cellar_name) => {
    if (this.state.selected_cellar_id === cellar_id) return;
    this.setState({
      selected_cellar_id: cellar_id,
      selected_cellar_name: cellar_name
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
    if (this.state.search_term === search_term) return;
    this.setState({
      search_term
    }, () => {
      this.reloadInventory();
    });
  }

  handleSearchType = (type) => {
    this.setState({
      search_type: type,
      search_term: ''
    }, () => {
      this.reloadInventory();
    });
  }

  handleScannerRead = (input_string) => {
    if (this.state.search_type === "barcode")
      this.props.onScannerRead(this.state.hq_cellar_id, this.state.selected_cellar_id, input_string);
  }

  render() {
    return (
      <DashboardLayout
        toastMessage={this.props.isScannerLoading ? `Procesando cola de scanner quedan ${this.props.isScannerLoading} ...`:''}
        title="Reposición de inventario."
        menuTitle="1. Seleccion de tienda"
        menu={
          <Stores
            accessToken={this.props.accessToken}
            cellarSelected={this.handleSelectedCellar}
            onHQCellarLoaded={this.handleHQCellar}
          />
        }

        tableTitle={
          "2. Productos" + (this.state.selected_cellar_name !== "" ?
          ` | usted esta reponiendo para la bodega ${this.state.selected_cellar_name}`:
          "")
        }
        table={
          <Stock
            loadKey={this.props.loadKey}
            selectedCellar={this.state.selected_cellar_id}
            extraProducts={this.props.extraProducts}
            products={this.props.products}
            isLoading={this.props.isLoading}
            hasError={this.props.hasError}
            errorMessage={this.props.stockErrorMessage}
          />
        }
        tableControls={
          <DashboardControls
            selectedCellarID={this.state.selected_cellar_id}
            accessToken={this.props.accessToken}

            onSearchTermChange={this.handleSearch}
            onSearchTypeChange={this.handleSearchType}
            onPickerCleared={this.props.onPickerClear}
          ></DashboardControls>
        }
        tableDownControls={
          <ReactPaginate
            previousLabel={'anterior'}
            nextLabel={'siguiente'}
            breakLabel={'...'}
            pageCount={this.props.pageCount}
            forcePage={this.state.current_page}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
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
        }
      />
    );
  }
}

export const DashboardWithScanner = withBarcodeScanner(Dashboard);
