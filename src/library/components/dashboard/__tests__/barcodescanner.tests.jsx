import React from 'react';
import { mount } from "enzyme";

import { withBarcodeScanner } from "../barcodescanner";

describe("BarcodeScanner", () => {
  const t = withBarcodeScanner(<div />);

  test("it should render properly", () => {
    const wrapper = mount(<t />);
    expect(wrapper).toMatchSnapshot("detault");
  });

  test("it should handle scanner read", () => {
    const wrapper = mount(<t />);
    console.log(wrapper.instance());
    wrapper.instance().handleScannerRead("test");
  });

});
