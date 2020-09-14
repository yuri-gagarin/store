import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import StoreItemImgUplForm from "../../../../components/admin_components/store_items/forms/StoreItemImgUplForm";
// React.Context and State //
import { StateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";

describe("StoreItem Image Upload Form Tests", () => {

  describe("Render tests without any Image data", () => {
    let component: ShallowWrapper<React.FC>;

    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<StoreItemImgUplForm />)
     });

    it("Should properly render", () => {
      expect(component).toMatchSnapshot();
    });
    it("Should have one upload Button element", () => {
      const uplButton = component.find(Button);
      expect(uplButton.length).toEqual(1);
    });
    it("Should have an input", () => {
      const input = component.find("input");
      expect(input.length).toEqual(1);
    });
  });
  
  describe("Render tests with an Image file present", () => {
    let component: ShallowWrapper<React.FC>;
    let input: ShallowWrapper;

    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<StoreItemImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the ImgUpload button", () => {
      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the Cancel button", () => {
      const imgCanceldBtn = component.find("#store_itemImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
    it("Should properly handle the '#store_itemImgCancelBtn' and render correct local state", () => {
      const imgCancelBtn = component.find("#store_itemImgCancelBtn");
      imgCancelBtn.simulate("click");
      expect(component.find("#store_itemImgCancelBtn").length).toEqual(0);
      expect(component.find("#store_itemImgUploadBtn").length).toEqual(0);
      expect(component.find("#selectStoreItemImgBtn").length).toEqual(1);
    });
  });
  // MOCK Successful Image upload tests //
  describe("'#store_itemImgUploadBtn' functionality and successful upload and local state changes", () => {
    let component: ReactWrapper<typeof StoreItemImgUplForm, {}, {}>;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount<React.FC<{}>, {}>(
        <StateProvider>
          <StoreItemImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully fire the 'uploadStoreItemImg' action and show loader", async () => {
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            updatedStoreItem: createMockStoreItems(1)[0]
          }
        });
      });

      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // loader should be displayed on th #store_itemImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      // update component and local state //
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        });
      });
    });
    it("Should correctly render Select Image button after 'successful upload", () => {
      const selectImgBtn = component.find("#selectStoreItemImgBtn");
      expect(selectImgBtn.length).toEqual(2);
    });
    it("Should NOT render Image Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render Cancel Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  describe("'#cancelStoreItemImgUploadBtn' functionality and a failed upload", () => {
    let component: ReactWrapper<React.FC>;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount<React.FC<{}>, {}>(
        <StateProvider>
          <StoreItemImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the 'uploadStoreItemImg' action error", async () => {
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {
            responseMsg: "Error",
            error: new Error("Oops")
          }
        });
      });

      const imgUpoadBtn = component.find("#store_itemImgUploadBtn").at(0);
      imgUpoadBtn.simulate("click");
      // loader should be displayed on th #store_itemImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      // update component and local state //
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        });
      });
    });
    it("Should NOT render Select Image button after a 'failed' upload", () => {
      const selectImgBtn = component.find("#selectStoreItemImgBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    it("Should render Image Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    })
    it("Should render Cancel Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find("#store_itemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    });
  });
  // END Mock unsuccessful Image upload tests //
});