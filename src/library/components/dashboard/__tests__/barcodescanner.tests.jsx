import React from 'react';
import { shallow } from "enzyme";

import { withBarcodeScanner } from "../barcodescanner";

describe("BarcodeScanner", () => {
  class Wrapped extends React.Component {
    constructor(props) {
      super(props);
    }

    render = () => {
      return (<div>test</div>);
    }

  }
  const Test = withBarcodeScanner(Wrapped);

  test("it should render properly", () => {
    const wrapper = shallow(<Test />);
    expect(wrapper).toMatchSnapshot("detault");
  });

  test("it should handle scanner read", () => {
    const wrapper = shallow(<Test />);
    // console.log(wrapper.instance());
    wrapper.instance().wrapped = {
      handleScannerRead: jest.fn()
    };
    wrapper.instance().handleScannerRead("test");
    expect(wrapper.instance().wrapped.handleScannerRead).toHaveBeenCalledWith("test");

    // should not fail when handleScanner is falsy
    delete wrapper.instance().wrapped.handleScannerRead;
    wrapper.instance().handleScannerRead("test");
  });

  test("it should handle key event", async (done) => {
    const wrapper = shallow(<Test />);
    wrapper.instance().handleScannerRead = jest.fn();
    wrapper.instance().handleKeyUp({ key: "t" });
    wrapper.instance().handleKeyUp({ key: "e" });
    wrapper.instance().handleKeyUp({ key: "s" });
    wrapper.instance().handleKeyUp({ key: "t" });

    setTimeout(() => {
      expect(wrapper.instance().handleScannerRead).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().handleScannerRead).toHaveBeenCalledWith("test");

      done();
    }, 500);
  });
});
