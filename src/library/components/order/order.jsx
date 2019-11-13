import React from 'react';
import PropTypes from 'prop-types';
import { OrderModal } from "./ordermodal";
import { PickerStore, Orders, StoreLoader } from '../../services';
import "./order.css";


export class GenerateOrderButton extends React.Component {

  static propTypes = {
    selectedCellar: PropTypes.number,
    accessToken: PropTypes.string,
    onOrderGenerated: PropTypes.func
  }

  static Statusses = {
    IDLE: 0,
    GENERATING: 1,
    DONE: 2
  }

  static defaultProps = {
    onOrderGenerated: () => { }
  }

  constructor(props) {
    super(props);

    this.state = {
      button_status: GenerateOrderButton.Statusses.IDLE,
      is_modal_open: false,
      order_id: -1
    }
  }

  _generateOrderData = () => {
    let picker_data,
      products;

    picker_data = PickerStore.get(this.props.selectedCellar);
    products = Object.keys(picker_data).map((item) => {
      return {
        "sku": item,
        "price": 0,
        "name": "",
        "combination": "",
        "quantity": picker_data[item].value
      };
    });

    return {
      origin: "replenishments",
      payment_type: "guia",
      products: JSON.stringify(products)
    };
  }

  _sendShippedOrder = async () => {
    let json_data,
      post_data,
      order_id,
      order_service;
    order_service = new Orders(this.props.accessToken);

    // create order in hype
    post_data = this._generateOrderData();
    post_data.extra_info = JSON.stringify({ "destination_cellar": this.props.selectedCellar });
    json_data = await order_service.create(post_data);

    // update order in hype
    if (json_data.status === "success") {
      order_id = json_data.order.id;
      await order_service.update(order_id, { status: "despachado" });
      return order_id;
    }
  }

  _resetSuggestions = async () => {
    await (new StoreLoader(this.props.accessToken)).resetSuggested(this.props.selectedCellar)
  }

  handleClick = async () => {
    let order_id;

    // change status
    this.setState({ button_status: GenerateOrderButton.Statusses.GENERATING });

    // generate order
    order_id = await this._sendShippedOrder();
    this.setState({
      is_modal_open: true,
      order_id
    });

    // clear picker
    PickerStore.clear(this.props.selectedCellar);
    // clear suggested
    this._resetSuggestions()

    this.props.onOrderGenerated();
    this.setState({ button_status: GenerateOrderButton.Statusses.DONE });

    setTimeout(() => {
      this.setState({ button_status: GenerateOrderButton.Statusses.IDLE });
    }, 5000);
  }

  getMessage = () => {
    let message;
    if (this.state.button_status === GenerateOrderButton.Statusses.IDLE)
      message = "Generar guía";
    else if (this.state.button_status === GenerateOrderButton.Statusses.GENERATING)
      message = "Generando...";
    else if (this.state.button_status === GenerateOrderButton.Statusses.DONE)
      message = "Guía enviada";

    return message;
  }

  render = () => {
    return (
      <>
        <button
          type="button"
          disabled={this.state.button_status !== GenerateOrderButton.Statusses.IDLE}
          onClick={this.handleClick}
          className="btn btn-primary ml-1"
        >
          {this.getMessage()}
        </button>
        <OrderModal
          accessToken={this.props.accessToken}
          isOpen={this.state.is_modal_open}
          orderId={this.state.order_id}
          onClose={() => { this.setState({ is_modal_open: false }) }}
        />
      </>
    );
  }
}
