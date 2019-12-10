import React, { Component } from 'react';
import PropTypes from "prop-types";

import {
  LogoutButton,
  PickerClearButton,
  SearchInput,
  GenerateOrderButton,
  PrintButton
} from '../../components';


export class DashboardControls extends Component {

  static propTypes = {
    selectedCellarID: PropTypes.number,
    accessToken: PropTypes.string,
    onSearchTermChange: PropTypes.func,
    onPickerCleared: PropTypes.func
  }

  render = () => {
    return (
      <React.Fragment>
        <div className="col-6" >
          <SearchInput
            onSearch={this.props.onSearchTermChange}
            onTypeChange={this.props.onSearchTypeChange}
          ></SearchInput>
        </div>
        <div className="col-6 text-right">
          <PickerClearButton
            selected_cellar_id={this.props.selectedCellarID}
            onPickerClear={this.props.onPickerCleared}
          ></PickerClearButton>
          <PrintButton></PrintButton>
          <GenerateOrderButton
            selectedCellar={this.props.selectedCellarID}
            accessToken={this.props.accessToken}
            onOrderGenerated={this.props.onPickerCleared}
          ></GenerateOrderButton>
          <LogoutButton></LogoutButton>
        </div>
      </React.Fragment>
    );
  }
}
