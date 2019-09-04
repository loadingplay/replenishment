import React from 'react';
import { PickerStore, Orders } from '../services';

export class GenerateOrderButton extends React.Component {

  static Statusses = {
    IDLE: 0,
    GENERATING: 1,
    DONE: 2
  }

  static defaultProps = {
    onOrderGenerated: () => {}
  }

  constructor(props) {
    super(props);

    this.state = {
      button_status: GenerateOrderButton.Statusses.IDLE
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
    json_data = await order_service.create(post_data);

    // update order in hype
    if (json_data.status === "success") {
      order_id = json_data.order.id;
      await order_service.update(order_id, {status: "despachado"});
    }
  }

  handleClick = async () => {
    // change status
    this.setState({ button_status: GenerateOrderButton.Statusses.GENERATING });

    // generate order
    await this._sendShippedOrder();

    PickerStore.clear(this.props.selectedCellar);
    this.props.onOrderGenerated();
    this.setState({ button_status: GenerateOrderButton.Statusses.DONE });
    setTimeout(() => {
      this.setState({ button_status: GenerateOrderButton.Statusses.IDLE });
    }, 5000);
  }

  getMessage = () => {
    let message;
    if (this.state.button_status === GenerateOrderButton.Statusses.IDLE)
      message = "generar guía";
    else if (this.state.button_status === GenerateOrderButton.Statusses.GENERATING)
      message = "generando...";
    else if (this.state.button_status === GenerateOrderButton.Statusses.DONE)
      message = "guía enviada";

    return message;
  }

  render = () => {
    return (
      <button
        type="button"
        disabled={this.state.button_status !== GenerateOrderButton.Statusses.IDLE}
        onClick={this.handleClick}
        className="btn btn-primary btn-block float-right"
      >
        {this.getMessage()}
      </button>
    );
  }
}
