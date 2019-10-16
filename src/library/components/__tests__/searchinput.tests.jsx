import React from 'react';
import { shallow } from 'enzyme';
import { SearchInput } from "../searchinput";

describe("SearchInput", () => {
  test("it should render a seach box", () => {
    const wrapper = shallow(<SearchInput />);

    expect(wrapper).toMatchSnapshot("default");
  });

  test("it should change search type", () => {
    const onTypeChange = jest.fn();
    const wrapper = shallow(<SearchInput onTypeChange={onTypeChange} />);

    expect(wrapper.instance().state.type).toEqual("search");
    expect(onTypeChange).toHaveBeenCalledTimes(0);
    wrapper.instance().changeType();
    expect(wrapper.instance().state.type).toEqual("barcode");
    expect(onTypeChange).toHaveBeenCalledTimes(1);
    wrapper.instance().changeType();
    expect(wrapper.instance().state.type).toEqual("search");
    expect(onTypeChange).toHaveBeenCalledTimes(2);
  });

  test("it should handle when keydown", () => {
    const wrapper = shallow(<SearchInput />);
    const e = { key: "Enter", target: { select: jest.fn() } };

    wrapper.instance().textInput = { current: { focus: jest.fn() } };

    expect(wrapper.instance().textInput.current.focus).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown({ key: "t" });
    expect(wrapper.instance().textInput.current.focus).toHaveBeenCalledTimes(1);

    expect(e.target.select).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown(e);
    expect(e.target.select).toHaveBeenCalledTimes(1);
  });

  test("it should handle changes", () => {
    const wrapper = shallow(<SearchInput />);

    wrapper.instance().handleSearch = jest.fn();

    expect(wrapper.instance().state.value).toEqual("");
    wrapper.instance().handleChange({ target: { value: "test" } });
    expect(wrapper.instance().state.value).toEqual("test");
    expect(wrapper.instance().handleSearch).toHaveBeenCalledWith("test");
  });

});
