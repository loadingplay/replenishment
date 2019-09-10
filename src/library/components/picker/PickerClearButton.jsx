import React from 'react';
import PropTypes from 'prop-types';
import { PickerStore } from '../../services';

export class PickerClearButton extends React.Component {

  propTypes = {
    selected_cellar_id: PropTypes.number,
    onPickerClear: PropTypes.func
  }

  static defaultProps = {
    onPickerClear: () => {}
  }

  handleClear = () => {
    PickerStore.clear(this.props.selected_cellar_id);
    this.props.onPickerClear();
  }

  render = () => {
    return (
      <button type="button" onClick={this.handleClear} className="btn btn-danger btn-block float-right" >
        limpiar picker
      </button>
    );
  }
}
