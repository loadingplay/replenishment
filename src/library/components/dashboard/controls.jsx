import React, { Component } from 'react';
import PropTypes from "prop-types";

import ReactPaginate from 'react-paginate';

import { PickerClearButton, SearchInput, GenerateOrderButton } from '../../components';


export class DashboardControls extends Component {

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
          <a className="btn btn-success btn-block float-right" href="/print" target="_blank" >
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
