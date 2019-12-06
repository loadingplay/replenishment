import React from 'react';
import PropTypes from 'prop-types';
import { OrderModal } from "./ordermodal";
import { PickerStore, Orders, StoreLoader, StockLoader } from '../../services';
import "./order.css";


export class GenerateOrderButton extends React.Component {

  static propTypes = {
    hqCellarId: PropTypes.number,
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
      error_message: [],
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
        "name": picker_data[item].product_data.product_name,
        "barcode": picker_data[item].product_data.barcode,
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

  _validateOrderStock = async (order_data, verification_cellar) => {
    let stock_service,
      list_of_products_to_verify,
      sku_list,
      promises,
      stock_list,
      sku_over_quantity;
      

    stock_service = new StockLoader(this.props.accessToken);
    list_of_products_to_verify = JSON.parse(order_data.products);
    sku_list = Array.from(list_of_products_to_verify, product => product.sku);
    stock_list = [];
    stock_service.max_instances = 10;
    promises = stock_service
      .load([verification_cellar], sku_list)
      .done((loaded_cellar, products) => {
        products.forEach((y_item) => {

          stock_list.push(y_item);
        });
      });
    
    await Promise.all(promises);

    sku_over_quantity = [];
    stock_list.forEach((kardex_element) => {
      list_of_products_to_verify.forEach((product) => {
        if (kardex_element.product_sku === product.sku) {
          if (product.quantity > kardex_element.balance_units) {
            sku_over_quantity.push({
              barcode: product.barcode,
              name: product.name,
              max_replenishment: kardex_element.balance_units.toString()}
            )
          }
        }
      });
    });
    return sku_over_quantity;
  }

  _sendShippedOrder = async () => {
    let json_data,
      post_data,
      order_id,
      order_service,
      verification_cellar,
      sku_over_quantity

    order_service = new Orders(this.props.accessToken);

    verification_cellar = this.props.hqCellarId;

    // create order in hype
    post_data = this._generateOrderData();
    post_data.extra_info = JSON.stringify({ "destination_cellar": this.props.selectedCellar });
    // verify stock
    sku_over_quantity = await this._validateOrderStock(
      post_data, verification_cellar);
    if (sku_over_quantity.length > 0) {
      return sku_over_quantity
    }
    else {
      
      json_data = await order_service.create(post_data);

      // update order in hype
      if (json_data.status === "success") {
        order_id = json_data.order.id;
        await order_service.update(order_id, { status: "despachado" });
        return order_id;
      }
    }
  }

  _resetSuggestions = async () => {
    await (new StoreLoader(this.props.accessToken)).resetSuggested(this.props.selectedCellar)
  }

  handleClick = async () => {
    let order_id,
      error_message;

    // change status
    this.setState({ button_status: GenerateOrderButton.Statusses.GENERATING });

    // generate order
    order_id = await this._sendShippedOrder();
    if (Array.isArray(order_id)) {
      this.setState({
        error_message: order_id
      });
      order_id = -1;
    }
    else {
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
    this.setState({
      is_modal_open: true,
      order_id
    });
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
          error_message={this.state.error_message}
          onClose={() => { this.setState({ is_modal_open: false }) }}
        />
      </>
    );
  }
}
