import React from "react";
import { shallow } from 'enzyme';

import { withDataLoader } from "../dataloader";
import { PickerStore } from '../../services';

describe("Orders", () => {

  beforeEach(jest.clearAllMocks);

  class Wrapped extends React.Component {
    render = () => {
      return <div></div>;
    }
  }

  const DataLoader = withDataLoader(Wrapped);

  test("it should match snapshot", () => {
    const wrapper = shallow(<DataLoader />, { disableLifecycleMethods: true });

    expect(wrapper).toMatchSnapshot('default');
  });

  test("it should load data from picker", () => {
    const wrapper = shallow(<DataLoader />, { disableLifecycleMethods: true });
    const instance = wrapper.instance();

    instance.store_api.getSelectedCellar = jest.fn().mockReturnValue({ id: "3" });
    PickerStore.getAll = jest.fn().mockReturnValue({ "3": "test" });

    instance.getDataFromPicker();

    expect(instance.store_api.getSelectedCellar).toHaveBeenCalledWith();
    expect(instance.picker_items).toEqual("test");
  });

  test("it should get data from API", async () => {
    const wrapper = shallow(<DataLoader />, { disableLifecycleMethods: true });
    const instance = wrapper.instance();

    instance.store_api.searchProducts = jest.fn().mockImplementation((page) => {
      if (page === 1)
        return {status: "success", replenishments: [{
          sku: "test sku",
          barcode: "test barcode",
          product_name: "test product_name",
          suggested: "test suggested"
        }]};

      return {};
    })
    instance.selected_cellar = { id: "test" }

    await instance.getDataFromAPI();

    expect(instance.state.loading_message).toEqual("Cargando todos los productos sugeridos...");
    expect(instance.store_api.searchProducts).toHaveBeenCalledWith(1, "test", "");
    expect(instance.state.api_items).toEqual([
      {
        "codigo": "test barcode",
        "existencia": {
          "casaMatriz": null,
          "local": null,
        },
        "falta": "test suggested",
        "hecho": 0,
        "insumo": "test product_name",
        "sku": "test sku"
      }
    ]);
  });
});
