import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import StoreImgUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockStores } from "../../../../test_helpers/storeHelpers";

describe("Store Image Upload Form Tests", () => {
  
  describe("Render tests without any Image data", () => {
    let wrapper: ShallowWrapper;

    beforeAll(() => {
      wrapper = shallow(<StoreImgUplForm />)
     });

    it("Should properly render", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should have one upload Button element", () => {
      const uplButton = wrapper.render().find("#selectStoreImgBtn");
      expect(uplButton.length).toEqual(1);
    });
    it("Should have an input", () => {
      const input = wrapper.find("input");
      expect(input.length).toEqual(1);
    });
  });
  
  describe("Render tests with an Image file present", () => {
    let wrapper: ShallowWrapper;
    let input: ShallowWrapper;

    beforeAll(() => {
      wrapper = shallow(<StoreImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });

    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the ImgUpload button", () => {
      const imgUpoadBtn = wrapper.render().find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the Cancel button", () => {
      const imgCanceldtn = wrapper.render().find("#storeImgCancelBtn");
      expect(imgCanceldtn.length).toEqual(1);
    });
    it("Should properly handle the '#storeImgCancelBtn' and render correct local state", () => {
      const imgCancelBtn = wrapper.find("#storeImgCancelBtn");
      imgCancelBtn.simulate("click");
      expect(wrapper.find("#storeImgCancelBtn").length).toEqual(0);
      expect(wrapper.find("#storeImgUploadBtn").length).toEqual(0);
      expect(wrapper.find("#selectStoreImgBtn").length).toEqual(1);
    });
  });
  
  // MOCK Successful Image upload tests //
  describe("'#storeImgUploadBtn' functionality, successful upload and local state changes", () => {
    let wrapper: ReactWrapper; let Mockstore: IStoreData;
    let input: ReactWrapper;

    beforeAll(() => {
      moxios.install();
      wrapper = mount(
        <TestStateProvider>
          <StoreImgUplForm />
        </TestStateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should successfully fire the 'uploadStoreImg' action and show loader", async () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            updatedService: createMockStores(1)[0]
          }
        });
      });

      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // loader should be displayed on th #serviceImgUploadBtn //
      const imgUpoadBtnLoading = wrapper.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
    });
    it("Should correctly render Select Image button after 'successful upload", async () => {
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            wrapper.update();
            res();
          }, 500);
        });
        
      });
      const selectImgBtn = wrapper.find("#selectStoreImgBtn");
      expect(selectImgBtn.length).toEqual(2);
    });
    it("Should NOT render Image Upload button after 'successful upload", () => {
      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render Cancel Upload button after 'successful upload", () => {
      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  
  describe("'#uploadStoreImgUploadBtn' functionality and a failed upload", () => {
    let wrapper: ReactWrapper<React.FC>;
    let input: ReactWrapper;

    beforeAll(() => {      moxios.install();

      wrapper = mount<React.FC<{}>, {}>(
        <TestStateProvider>
          <StoreImgUplForm />
        </TestStateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the 'uploadStoreImg' action error", async () => {
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

      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn").at(0);
      imgUpoadBtn.simulate("click");
      // loader should be displayed on the #storeImgUploadBtn //
      const imgUpoadBtnLoading = wrapper.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      // update wrapper and local state //
     
    });
    it("Should NOT render Select Image button after a 'failed' upload",  async() => {
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            wrapper.update();
            res();
          }, 500);
        });
      });
      const selectImgBtn = wrapper.find("#selectStoreImgBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    it("Should render Image Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    });
    it("Should render Cancel Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = wrapper.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    });
  });
  // END Mock unsuccessful Image upload tests //
  
});