import React from 'react';
import { shallow } from "enzyme";

import { Dashboard } from "../dashboard";

describe("Dashboard", () => {
  test("it should render properly", () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper).toMatchSnapshot("detault");
  });
});
