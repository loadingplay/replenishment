jest.mock("../../../services/orders");

import React from "react";
import { GenerateOrderButton } from "..";
import { shallow } from "enzyme";
import { PickerStore } from "../../../services";
import { Orders } from "../../../services/orders";


describe("GenerateOrderButton", () => {

  beforeEach(() => {
    PickerStore.clear(2);
    jest.clearAllMocks();
  });

  test("it should render the button from status", async () => {
    const wrapper = shallow(<GenerateOrderButton />);

    expect(wrapper).toMatchSnapshot("default");
    expect(wrapper.childAt(0).prop("disabled")).toBeFalsy();

    wrapper.setState({
      button_status: GenerateOrderButton.Statusses.GENERATING
    });
    expect(wrapper.childAt(0).prop('disabled')).toBeTruthy();
    expect(wrapper).toMatchSnapshot("loading");

    wrapper.setState({
      button_status: GenerateOrderButton.Statusses.DONE
    });
    expect(wrapper.childAt(0).prop('disabled')).toBeTruthy();
    expect(wrapper).toMatchSnapshot("done");
  });

  test("it should generate order data", () => {
    const wrapper = shallow(<GenerateOrderButton selectedCellar={2} />);

    expect(
      wrapper.instance()._generateOrderData()
    ).toMatchSnapshot("order-data-empty");
    
    PickerStore.set(2, "test-sku", 1, 10, 10, 10, false, {product_name: "name", barcode: "barcode"});
    expect(
      wrapper.instance()._generateOrderData()
    ).toMatchSnapshot("order-data-with-one-product");

  });

  test("it should validate order stock, and return empty list of sku over quantity", () => {
    let order_data, verification_cellar;
    const wrapper = shallow(<GenerateOrderButton selectedCellar={2} hqCellarId={1}/>);
    verification_cellar = 2;
    order_data = {
      products: JSON.stringify([{
        sku: "sku",
        name: "name",
        barcode: "barcode",
        quantity: 1
      }])
    };
    global.fetch = jest.fn().mockResolvedValue({ 
      json: () => {
         return { products: [{
           product_sku: "sku",
           balance_units: 1

          }] 
        } 
      } 
    });
    expect(
      wrapper.instance()._validateOrderStock(order_data, verification_cellar)
    ).toMatchSnapshot("sku-over-quantity-empty");

  });
  
  test("it should validate order stock, and return list of sku over quantity", () => {
    let order_data, verification_cellar;
    const wrapper = shallow(<GenerateOrderButton selectedCellar={2} hqCellarId={1}/>);
    verification_cellar = 2;
    order_data = {
      products: JSON.stringify([{
        sku: "sku",
        name: "name",
        barcode: "barcode",
        quantity: 1
      }])
    };
    global.fetch = jest.fn().mockResolvedValue({ 
      json: () => {
         return { products: [{
           product_sku: "sku",
           balance_units: 0

          }] 
        } 
      } 
    });
    expect(
      wrapper.instance()._validateOrderStock(order_data, verification_cellar)
    ).toMatchSnapshot("sku-over-quantity");

  });

  test("it should send shipped order to api", async () => {
    const wrapper = shallow(<GenerateOrderButton selectedCellar={2} />);

    PickerStore.clear(2);
    Orders.prototype.create = jest.fn().mockReturnValue({});
    Orders.prototype.update = jest.fn().mockReturnValue({});

    await wrapper.instance()._sendShippedOrder();
    expect(Orders.prototype.create).toHaveBeenCalledWith({
      "extra_info": "{\"destination_cellar\":2}",
      "origin": "replenishments",
      "payment_type": "guia",
      "products": "[]"
    });
    expect(Orders.prototype.update).toHaveBeenCalledTimes(0);

    // add products
    Orders.prototype.create = jest.fn().mockReturnValue({
      "status": "success",
      "order": {
        "id": 1
      }
    });
    PickerStore.set(2, "test-sku", 1, 10, 10, 10, false, {product_name: "" });
    await wrapper.instance()._sendShippedOrder();
    expect(Orders.prototype.create).toHaveBeenCalledWith({
      "extra_info": "{\"destination_cellar\":2}",
      "origin": "replenishments",
      "payment_type": "guia",
      "products": "[{\"sku\":\"test-sku\",\"price\":0,\"name\":\"\",\"combination\":\"\",\"quantity\":1}]"
    });
    expect(Orders.prototype.update).toHaveBeenCalledWith(
      1, {"status": "despachado"}
    );
  });


  test("it should faild create on create shipping order to api", async () => {
    const wrapper = shallow(<GenerateOrderButton selectedCellar={2} />);

    // mock validate stock
    wrapper.instance()._validateOrderStock = jest.fn().mockResolvedValue([
      {
        barcode: "barcode",
        name: "name",
        max_replenishment: 0
      }
    ])
    expect(
      wrapper.instance()._sendShippedOrder()
    ).toMatchSnapshot("sku-over-quantity");
  });

  test("it should execute all sync within click", async () => {
    const wrapper = shallow(
      <GenerateOrderButton
        onOrderGenerated={jest.fn().mockReturnValue(1)}
      />
    );

    wrapper.instance()._sendShippedOrder = jest.fn().mockResolvedValue(1);
    wrapper.instance()._resetSuggestions = jest.fn().mockResolvedValue(1);

    let promise = wrapper.instance().handleClick();
    expect(wrapper.instance().state.button_status).toEqual(GenerateOrderButton.Statusses.GENERATING);
    expect(wrapper.instance()._sendShippedOrder).toHaveBeenCalledTimes(1);

    await promise;
    expect(wrapper.instance().props.onOrderGenerated).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().state.button_status).toEqual(GenerateOrderButton.Statusses.DONE);
  });

  test("it should fail on execute all sync within click", async () => {
    const wrapper = shallow(
      <GenerateOrderButton
        onOrderGenerated={jest.fn().mockReturnValue(1)}
      />
    );

    wrapper.instance()._sendShippedOrder = jest.fn().mockResolvedValue([
      {
        barcode: "barcode",
        name: "name",
        max_replenishment: 0
      }
    ]);
    wrapper.instance()._resetSuggestions = jest.fn().mockResolvedValue(1);
    let promise = wrapper.instance().handleClick();
    expect(wrapper.instance().state.button_status).toEqual(GenerateOrderButton.Statusses.GENERATING);
    expect(wrapper.instance()._sendShippedOrder).toHaveBeenCalledTimes(1);
    await promise;
    expect(wrapper.instance().props.onOrderGenerated).toHaveBeenCalledTimes(0);
    expect(wrapper.instance().props.onOrderGenerated).toHaveBeenCalledTimes(0);
    expect(wrapper.state().order_id).toEqual(-1)
  });

});
