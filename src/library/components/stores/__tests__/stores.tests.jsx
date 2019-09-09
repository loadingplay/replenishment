import React from "react";
import { Stores } from "../stores";
import { shallow } from "enzyme";


describe("Stores", () => {
  test("it should reder", () => {
    const wrapper = shallow(
      <Stores></Stores>
    );

    expect(wrapper.instance().load_status).toEqual("idle");
    expect(wrapper).toMatchSnapshot("default");
  });

  test("it should try to load cellars", () => {
    const wrapper = shallow(
      <Stores />
    );

    wrapper.instance().loadCellars = jest.fn().mockResolvedValue({});
    wrapper.setProps({
      accessToken: "test-token"
    });

    expect(wrapper.instance().loadCellars).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().loadCellars).toBeCalledWith("test-token");
  });

  test("it should call load cellars from api", async () => {
    let promise;
    const wrapper = shallow(<Stores onHQCellarLoaded={jest.fn().mockReturnThis()} />);

    wrapper.instance().store_api.loadCellars = jest.fn().mockResolvedValue({
      cellars: [
        {
          id: 1,
          for_sale: false
        },{
          id: 2,
          for_sale: true
        }
      ]
    });

    expect(wrapper.instance().load_status).toEqual("idle");
    promise = wrapper.instance().loadCellars("test-token");
    expect(wrapper.instance().load_status).toEqual("loading");
    await promise;
    expect(wrapper.instance().props.onHQCellarLoaded).toHaveBeenCalledWith(2);
    expect(wrapper.instance().load_status).toEqual("loaded");
  });
});
