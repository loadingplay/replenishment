import React from 'react';
import { PickerStore } from '../../services';

export class PickerClearButton extends React.Component {
  static defaultProps = {
    onPickerClear: () => {}
  }

  constructor(props) {
    super(props);
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
