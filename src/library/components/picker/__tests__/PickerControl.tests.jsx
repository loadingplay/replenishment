import React from 'react';
import { shallow } from "enzyme";

import { PickerControl } from "../PickerControl";

describe("PickerControl", () => {
  test("it should render properly", () => {
    const wrapper = shallow(
      <PickerControl
        item={{
          sku: "test-sku"
        }}
      ></PickerControl>
    );
    expect(wrapper).toMatchSnapshot("detault");
    expect(wrapper.instance().state.options.disabled).toEqual('disabled');
  });

  test("it should update options when it is initialized with all data", () => {
    const wrapper = shallow(
      <PickerControl
        item={{
          sku: "test-sku",
          hq_inventory: 10,
          current_inventory: 5
        }}
      >
      </PickerControl>
    );

    expect(wrapper.instance().state.options).toEqual({})
  });

  test("it should add and substract 1 from picker", async () => {
    const wrapper = shallow(
      <PickerControl
        item={{
          sku: "test-sku",
          hq_inventory: 10,
          current_inventory: 5
        }}
      ></PickerControl>
    );

    expect(wrapper.instance().state.q).toEqual(0);
    wrapper.find("button").at(1).simulate('click');
    expect(wrapper.instance().state.q).toEqual(1);
    wrapper.find("button").at(0).simulate('click');
    expect(wrapper.instance().state.q).toEqual(0);
  });
});
