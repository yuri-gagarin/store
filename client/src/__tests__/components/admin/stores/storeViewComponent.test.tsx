import React, { PropsWithChildren } from "react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreViewComponent from "../../../../components/admin_components/stores/StoreView";
// additional dependencies //
import  { BrowserRouter as Router } from "react-router-dom";

describe("StoreView Component test", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount(
      <Router>
        <StoreViewComponent />
      </Router>
    );
  })
  describe("StoreView Component render test", () => {
    it("Should correctly mount", () => {
      expect(component).toBeDefined();
    });
    it("Should render Admin Store Menu", () => {
      expect(component.find("AdminStoreMenu")).toHaveLength(1);
    });
    it("Should render conditional routes", () => {
      expect(component.find("Switch")).toHaveLength(1);
    });
    it("Should have Render three three children route componets", () => {
      const wrapper: ReactWrapper = component.find("Switch");
      console.log(wrapper.children().html())
    })
  })
})