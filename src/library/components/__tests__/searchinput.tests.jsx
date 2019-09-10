import React from 'react';
import { shallow } from 'enzyme';
import { SearchInput } from "../searchinput";

describe("SearchInput", () => {
  test("it should render a seach box", () => {
    const wrapper = shallow(<SearchInput />);

    expect(wrapper).toMatchSnapshot("default");
  });
});
