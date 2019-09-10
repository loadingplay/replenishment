import React from 'react';
import { shallow } from "enzyme";

import { DashboardControls } from "../controls";

describe("DashboardControls", () => {
  test("it should render properly", () => {
    const wrapper = shallow(<DashboardControls />);
    expect(wrapper).toMatchSnapshot("detault");
  });
});
