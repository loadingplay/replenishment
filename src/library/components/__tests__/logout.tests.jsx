import React from "react";
import { shallow } from 'enzyme';

import { LogoutButton } from "../logout";

describe("Logout", () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterEach(() => {
    process.env = {...OLD_ENV};
  })

  test("it should render logout button", () => {

    process.env.PROJECT_URL = "http://test-url";

    const wrapper = shallow(
      <LogoutButton />,
      {
        disableLifecycleMethods: true
      }
    );
    expect(wrapper).toMatchSnapshot("default");
  });
});
