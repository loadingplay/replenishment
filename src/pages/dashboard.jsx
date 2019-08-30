import React, { Component } from 'react';

import ReactPaginate from 'react-paginate';

import { PickerClearButton, LogoutButton, Stock, Stores, SearchInput } from '../library/components';
import { GenerateOrderButton } from '../library/components/order';

export default class dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "access_token": "",
      "selected_cellar_id": 0,
      "current_page": 0,
      "page_count": 1,
      "load_key": 1
    };
  }
  /* products */

  handleSelectedCellar = (cellar_id) => {
    this.setState({
      "selected_cellar_id": cellar_id
    });
  }

  handlePageClick = (e) => {
    this.setState({
      current_page: e.selected
    });
  }

  handlePickerClear = () => {
    this.setState({
      "load_key": this.state.load_key + 1
    });
  }

  handlePageCountLoaded = (page_count) => {
    this.setState({
      page_count
    });
  }

  componentDidMount = () => {
    let access_token = window.localStorage.getItem("access_token");
    this.setState({access_token});
  }

  handleHQCellar = (hq_cellar_id) => {
    this.setState({
      hq_cellar_id: hq_cellar_id
    })
  }

  handleSearch = (term) => {
    console.log("aaaa", term);
  }

  render() {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_elements row">
          <h3 className="dashboard_title col-12">
            Reposición de inventario.
          </h3>

          {/* Stores */}
          <div className="col-2" >
            <div className="subtitle">1. Seleccion de tienda</div>
            <Stores
              access_token={this.state.access_token}
              cellarSelected={this.handleSelectedCellar}
              onHQCellarLoaded={this.handleHQCellar}
            />
          </div>

          {/* Inventory table */}
          <div className="col-10 row" >
            <div className="subtitle col-6">
              2. Pedidos
            </div>
            <div className="col-6">
              <LogoutButton></LogoutButton>
            </div>
            <Stock
              currentPage={this.state.current_page}
              selectedCellar={this.state.selected_cellar_id}
              hqCellar={this.state.hq_cellar_id}
              loadKey={this.state.load_key}
              accessToken={this.state.access_token}
              onPageCountLoaded={this.handlePageCountLoaded}
            />

            {/* Controls */}
            <section className="controls col-12 row">
              <div className="col-12" >
                <ReactPaginate
                  previousLabel={'anterior'}
                  nextLabel={'siguiente'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.page_count}
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
              </div>
              <div className="col-4" >
                <SearchInput
                  onSearch={this.handleSearch}
                ></SearchInput>
              </div>
              <div className="col-4 offset-md-4 row">
                <PickerClearButton
                  selected_cellar_id={this.state.selected_cellar_id}
                  onPickerClear={this.handlePickerClear}
                ></PickerClearButton>
                <a type="button" className="btn btn-success btn-block float-right" href="/print" target="_blank" >
                  imprimir
                </a>
                <GenerateOrderButton
                  selectedCellar={this.state.selected_cellar_id}
                  accessToken={this.state.access_token}
                  onOrderGenerated={this.handlePickerClear}
                ></GenerateOrderButton>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}
