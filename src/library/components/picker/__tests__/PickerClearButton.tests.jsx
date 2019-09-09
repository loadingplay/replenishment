import React from 'react';
import { shallow } from "enzyme";

import { PickerClearButton } from "../PickerClearButton";

describe("PickerClearButton", () => {
  test("it should render properly", () => {
    const wrapper = shallow(<PickerClearButton></PickerClearButton>);
    expect(wrapper).toMatchSnapshot("detault");
  });
});
