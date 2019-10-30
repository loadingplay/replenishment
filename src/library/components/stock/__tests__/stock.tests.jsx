import React from 'react';
import { shallow } from "enzyme";

import { Stock } from "../stock";

describe("Stock", () => {
  test("it should render empty", () => {
    const wrapper = shallow(<Stock></Stock>);
    expect(wrapper).toMatchSnapshot("empty");
  });

  test("it should render with loading message", () => {
    const wrapper = shallow(
      <Stock
        selectedCellar={1}
        hasError={false}
        errorMessage=""
        isLoading={true}
        extraProducts={[]}
        products={[]}
        loadKey={1}
      ></Stock>
    );
    expect(wrapper).toMatchSnapshot("loading message");
  });

  test("it should render with error message", () => {
    const wrapper = shallow(
      <Stock
        selectedCellar={1}
        hasError={true}
        errorMessage="error message"
        isLoading={false}
        extraProducts={[]}
        products={[]}
        loadKey={1}
      ></Stock>
    );
    expect(wrapper).toMatchSnapshot("error message");
  });

  test("it should render with products", () => {
    const wrapper = shallow(
      <Stock
        selectedCellar={1}
        hasError={false}
        errorMessage=""
        isLoading={false}
        extraProducts={[]}
        products={[{}]}
        loadKey={1}
      />
    );
    expect(wrapper).toMatchSnapshot("with products");
  });
});
