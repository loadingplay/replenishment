import React from 'react';
import PropTypes from "prop-types";
import { PickerStore } from '../../services';
import "./picker.css";

export class PickerControl extends React.Component {

  static propTypes = {
    cellar_id: PropTypes.number,
    item: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      q: PickerStore.get(this.props.cellar_id, this.props.item.sku),
      options: {}
    };

    if (this.props.item.hq_inventory === undefined || this.props.item.current_inventory === undefined)
      this.state.options.disabled = 'disabled';
  }

  componentDidUpdate = () => {
    if (this.state.options.disabled !== undefined
      && this.props.item.hq_inventory !== undefined
      && this.props.item.current_inventory !== undefined
    ) {
      this.setState({ options: {} });
    }
  }

  handleUpdate = () => {
    PickerStore.set(
      this.props.cellar_id,
      this.props.item.sku,
      this.state.q,
      this.props.item.hq_inventory,
      this.props.item.current_inventory,
      this.props.item.suggested
    );
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
      <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div className="btn-group" role="group" aria-label="First group">
          <button {...this.state.options} type="button" onClick={this.handleMinus} className="btn btn-outline-secondary">-</button>
          <input {...this.state.options} type="text" className="form-control text-center picker-input" onChange={this.handleChange} value={this.state.q} />
          <button {...this.state.options} type="button" onClick={this.handlePlus} className="btn btn-outline-secondary">+</button>
        </div>
      </div>
    )
  }
}
