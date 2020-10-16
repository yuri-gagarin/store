import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import StoreItemImgUplForm from "../../../../components/admin_components/store_items/forms/StoreItemImgUplForm";
// React.Context and State //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockStoreItemImage, createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("StoreItem Image Upload Form Tests", () => {
  let mockStoreItemData: IStoreItemData;

  beforeAll(() => {
    mockStoreItemData = createMockStoreItems(1)[0];
    mockStoreItemData.images[0] = createMockStoreItemImage(mockStoreItemData._id)
  });

  describe("Render tests without any Image data", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(<StoreItemImgUplForm />)
     });

    it("Should properly render", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render one '#storeItemImgSelectBtn' element", () => {
      const selectImgBtn = wrapper.render().find("#storeItemImgSelectBtn");
      expect(selectImgBtn.length).toEqual(1);
    });
    it("Should NOT render '#storeItemImgUplControls' element", () => {
      const controls = wrapper.render().find("#storeItemImgUplControls");
      expect(controls.length).toEqual(0);
    });
    it("Should have an input", () => {
      const input = wrapper.find("input");
      expect(input.length).toEqual(1);
    });
  });
  
  describe("Render tests with an Image file present", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(<StoreItemImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the '#storeItemImgUploadlBtn", () => {
      const uplBtn = wrapper.render().find("#storeItemImgUploadBtn");
      expect(uplBtn.length).toEqual(1);
    });
    it("Should successfully update and render the '#storeItemImgCancelBtn'", () => {
      const cancelBtn = wrapper.render().find("#storeItemImgCancelBtn");
      expect(cancelBtn.length).toEqual(1);
    });
    it("Should NOT render the '#storeItemImgRetryUplBtn'", () => {
      const retryBtn = wrapper.render().find("#storeItemImgRetryUplBtn");
      expect(retryBtn.length).toEqual(0)
    });
    it("Should properly handle the '#storeItemImgCancelBtn' click and render correct local state", () => {
      const imgCancelBtn = wrapper.find("#storeItemImgCancelBtn");
      imgCancelBtn.at(0).simulate("click");
      // assert correct rendering //
      expect(wrapper.render().find("#storeItemImgCancelBtn").length).toEqual(0);
      expect(wrapper.render().find("#storeItemImgUploadBtn").length).toEqual(0);
      expect(wrapper.render().find("#storeItemImgSelectBtn").length).toEqual(1);
    });
  });
  // MOCK Successful Image upload tests //
  describe("'#storeItemImgUploadBtn' functionality and successful upload and local state changes", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      const state = generateCleanState();
      state.storeItemState.currentStoreItemData = mockStoreItemData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/store_item_images/${mockStoreItemData._id}`, {
        status: 200,
        response: {
          responseMsg: "ok",
          updatedStoreItem: mockStoreItemData
        }
      });

      wrapper = mount(
        <TestStateProvider mockState={state}>
          <StoreItemImgUplForm />
        </TestStateProvider>
      );
      // mock a file attached //
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });
    it("Should dispatch a 'correct' API request show 'loader'", async () => {
      const promise = Promise.resolve();
      const imgUpoadBtn = wrapper.find("#storeItemImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // clear promises //
      await act( async () => promise);
      const uploadButton = wrapper.find(StoreItemImgUplForm).find(Button).at(0);
      expect(uploadButton.props().loading).toEqual(true);
    });
    it("Should correctly render '#storeItemImgSelectBtn' button after 'successful' upload", () => {
      wrapper.update();
      const selectImgBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgSelectBtn");
      //console.log(wrapper.debug())
      expect(selectImgBtn.length).toEqual(1);
    });
    it("Should NOT render '#storeItemImgRetryBtn' button after 'successful' upload", () => {
      const imgUpoadBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgRetryBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render '#storeItemImgUploadBtn' button after 'successful' upload", () => {
      const imgUpoadBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  describe("'#storeItemImgCancelBtn' functionality and a failed upload", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;
    const error = new Error("An Error Occured");

    beforeAll(() => {
      const state = generateCleanState();
      state.storeItemState.currentStoreItemData = mockStoreItemData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/store_item_images/${mockStoreItemData._id}`, {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <TestStateProvider mockState={state}>
          <StoreItemImgUplForm />
        </TestStateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the '#storeItemImgUploadBtn' API error, render 'loader'", async () => {
      const promise = Promise.resolve();
      const imgUpoadBtn = wrapper.find("#storeItemImgUploadBtn").at(0);

      imgUpoadBtn.simulate("click");
      // loader should be displayed on the  #storeItemImgUploadBtn //
      await act( async() => promise);
      const updatedButton = wrapper.find(StoreItemImgUplForm).find(Button).at(0);
      expect(updatedButton.props().loading).toEqual(true);
    });
    it("Should render '#storeItemImgRetryButton' button after a 'failed' upload", () => {
      wrapper.update();
      const imgUpoadBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgRetryUplBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should render '#storeItemImgCancelBtn' button after a 'failed' upload", () => {
      const imgUpoadBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgCancelBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should NOT render '#storeItemImgSelectBtn' button after a 'failed' upload", () => {
      const selectImgBtn = wrapper.find(StoreItemImgUplForm).render().find("#storeItemImgSelectBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
  });
  // END Mock unsuccessful Image upload tests //
});