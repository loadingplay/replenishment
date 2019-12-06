import React from "react";
import { OrderModal } from "..";
import { shallow } from "enzyme";


describe("OrderModal", () => {
  it("should match snap shot", () => {
    const wrapper = shallow(<OrderModal error_message={[]} />, { disableLifecycleMethods: true });
    expect(wrapper).toMatchSnapshot();
  });
  
  it("should load document", async (done) => {
    
    const wrapper = shallow(<OrderModal error_message={[]}/>, {disableLifecycleMethods: true});
    wrapper.instance().order_service.get = jest.fn().mockReturnValue({
      order: {
        extra_info: JSON.stringify({dispatch_guide: {url: "test"}})
      }
    });

    await wrapper.instance().loadDocument();
    expect(wrapper.instance().state.show_guide).toBeTruthy();
    expect(wrapper.instance().state.guide_url).toEqual("test");

    wrapper.instance().componentDidUpdate({ orderId: 1 });
    setTimeout(() => {
      expect(wrapper.instance().state.loading).toEqual('.');
      done();
    }, 2000);
  });

  it("should give an error message on modal", () => {
    const wrapper = shallow(<OrderModal error_message={[
      {
        barcode: "barcode",
        name: "name",
        max_replenishment: 0
      }
    ]} />, { disableLifecycleMethods: true });

    expect(wrapper.instance().modal_message()
    ).toMatchSnapshot("modal-error-messag")

  })

  it("should give an correct message in modal", () => {
    const wrapper = shallow(<OrderModal error_message={[
    ]} />, { disableLifecycleMethods: true });

    expect(wrapper.instance().modal_message()
    ).toMatchSnapshot("modal-load-messge");

  })

});
