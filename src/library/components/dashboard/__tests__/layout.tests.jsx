import React from 'react';
import { shallow } from "enzyme";

import { DashboardLayout } from "../layout";

describe("DashboardLayout", () => {
  test("it should render properly", () => {
    const wrapper = shallow(<DashboardLayout />);
    expect(wrapper).toMatchSnapshot("detault");
  });
});
