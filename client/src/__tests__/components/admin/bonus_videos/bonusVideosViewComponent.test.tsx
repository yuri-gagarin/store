import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
// testing dependencies //
import { mount, ReactWrapper } from "enzyme";
// component imports //
import BonusVideosViewComponent from "../../../../components/admin_components/bonus_videos/BonusVideosView";
import AdminBonusVideosMenu from "../../../../components/admin_components/menus/AdminBonusVideoMenu";
import { BonusVideosPreviewHolder } from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideosPreviewHolder";
import BonusVideosFormHolder from "../../../../components/admin_components/bonus_videos/forms/BonusVideosFormHolder";
import { BonusVideosManageHolder } from "../../../../components/admin_components/bonus_videos/bonus_video_manage/BonusVideosManageHolder";
// additional dependencies //
import  { MemoryRouter as Router, Switch } from "react-router-dom";

describe("BonusVideosView Component test", () => {
  let wrapper: ReactWrapper;
  beforeAll(() => {
    wrapper = mount(
      <Router keyLength={0} initialEntries={["/admin/home/my_videos"]}>
        <BonusVideosViewComponent />
      </Router>
    );
  });
  describe("BonusVideosView Component render test", () => {
    it("Should Properly render BonusVideosView", () => {
      const component = wrapper.find(BonusVideosViewComponent);
      expect(component).toMatchSnapshot();
    });
    it("Should render Admin BonusVideos Menu", () => {
      expect(wrapper.find(AdminBonusVideosMenu)).toHaveLength(1);
    });
    it("Should render conditional routes", () => {
      expect(wrapper.find(Switch)).toHaveLength(1);
    });
    it("Should have Render three children route componets", () => {
      const switchComponent = wrapper.find(Switch);
      expect(switchComponent.props().children).toHaveLength(3);
    });
    it("Should have proper client routes and conditionally render correct Components", () => {
      const switchComponent = wrapper.find(Switch);
      type RouteMap = {
        [key: string]: string
      }
      let map: RouteMap = {};

      const routeComponents = switchComponent.props().children as ReactElement[];
      for (const component of routeComponents) {
        if (component.props.children[1].type.WrappedComponent) {
          // to check if a component is wrapped in a WithRouter() function //
          map[component.props.path as string] = component.props.children[1].type.WrappedComponent;
        } else {
          map[component.props.path as string] = component.props.children[1].type;
        }
      }
      expect(map["/admin/home/my_videos/all"]).toBe(BonusVideosPreviewHolder);
      expect(map["/admin/home/my_videos/create"]).toBe(BonusVideosFormHolder);
      expect(map["/admin/home/my_videos/manage"]).toBe(BonusVideosManageHolder);
    });
  });
  describe("BonusVideosView Component button actions", () => {
    describe("AdminBonusVideosMenu", () => {
      it("Should have 4 main navigation links", () => {
        const adminBonusVideoMenu = wrapper.find(AdminBonusVideosMenu);
        const links = adminBonusVideoMenu.find(Menu.Item)
        expect(links.length).toEqual(4);
      });
      it("'View All Store Items' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminBonusVideosMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        // update and assert ///
        wrapper.update();
        expect(wrapper.find(BonusVideosPreviewHolder).length).toEqual(1);
        expect(wrapper.find(BonusVideosFormHolder).length).toEqual(0);
        expect(wrapper.find(BonusVideosManageHolder).length).toEqual(0);
      });
      it("'Create Store Item' link should properly function", () => {
        window.scrollTo = jest.fn();
        const createLink = wrapper.find(AdminBonusVideosMenu).find(Menu.Item).at(1);
        createLink.simulate("click");
        // update and assert //
        wrapper.update();
        expect(wrapper.find(BonusVideosPreviewHolder).length).toEqual(0);
        expect(wrapper.find(BonusVideosFormHolder).length).toEqual(1);
        expect(wrapper.find(BonusVideosManageHolder).length).toEqual(0);
      });
      it("'Manage Store Items' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminBonusVideosMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        // update and assert //
        wrapper.update();
        expect(wrapper.find(BonusVideosPreviewHolder).length).toEqual(0);
        expect(wrapper.find(BonusVideosFormHolder).length).toEqual(0);
        expect(wrapper.find(BonusVideosManageHolder).length).toEqual(1);
      });
    });
    
  });
})