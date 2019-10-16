import React from 'react';
import { shallow } from "enzyme";

import { Dashboard } from "../dashboard";

describe("Dashboard", () => {
  test("it should render properly", () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper).toMatchSnapshot("detault");
  });

  test("it should handle scanner reads", () => {

    const onScannerRead = jest.fn();
    const wrapper = shallow(<Dashboard onScannerRead={onScannerRead} />);

    wrapper.instance().setState({ search_type: "search" });
    wrapper.instance().handleScannerRead("test");
    expect(onScannerRead).toHaveBeenCalledTimes(0);

    wrapper.instance().setState({ search_type: "barcode" });
    wrapper.instance().handleScannerRead("test");
    expect(onScannerRead).toHaveBeenCalledTimes(1);
  });
});
