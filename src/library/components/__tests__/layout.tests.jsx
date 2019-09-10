import React from "react";
import { shallow } from 'enzyme';

import Layout from "../layout";

describe("Orders", () => {

  beforeEach(jest.clearAllMocks);

  test("it should asign right access token", () => {
    const wrapper = shallow(
      <Layout >test</Layout>,
      {
        disableLifecycleMethods: true
      }
    );
    expect(wrapper).toMatchSnapshot("default");
    expect(wrapper.children().debug()).toEqual("test");
  });
});
