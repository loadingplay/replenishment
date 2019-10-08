import React from "react";
import { OrderModal } from "..";
import { shallow } from "enzyme";


describe("OrderModal", () => {
  it("should match snap shot", () => {
    const wrapper = shallow(<OrderModal />, {disableLifecycleMethods: true});
    expect(wrapper).toMatchSnapshot();
  });

  it("should load document", async () => {
    const wrapper = shallow(<OrderModal />, {disableLifecycleMethods: true});
    wrapper.instance().order_service.get = jest.fn().mockReturnValue({
      order: {
        extra_info: JSON.stringify({dispatch_guide: {url: "test"}})
      }
    });

    await wrapper.instance().loadDocument();
    expect(wrapper.instance().state.show_guide).toBeTruthy();
    expect(wrapper.instance().state.guide_url).toEqual("test");
  });
});
