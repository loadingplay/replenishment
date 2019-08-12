import React from 'react';
import PickerStore from '../services/picker';

export default class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {q: PickerStore.get(this.props.cellar_id, this.props.sku)};
  }

  handleUpdate = () => {
    PickerStore.set(this.props.cellar_id, this.props.sku, this.state.q);
  }

  handlePlus = () => {
    this.setState({q: this.state.q + 1}, this.handleUpdate);
  }

  handleMinus = () => {
    if (this.state.q <= 0) return;
    this.setState({q: this.state.q - 1}, this.handleUpdate);
  }

  handleChange = (event) => {
    let new_value = parseInt(event.target.value);
    if (isNaN(new_value)) return;
    this.setState({q: new_value}, this.handleUpdate);
  }

  render = () => {
    return (
      <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
        <div className="btn-group mr-2" role="group" aria-label="First group">
          <button type="button" onClick={this.handleMinus} className="btn btn-outline-secondary">-</button>
          <input type="text" className="form-control text-center" onChange={this.handleChange} value={this.state.q} />
          <button type="button" onClick={this.handlePlus} className="btn btn-outline-secondary">+</button>
        </div>
      </div>
    )
  }
}
