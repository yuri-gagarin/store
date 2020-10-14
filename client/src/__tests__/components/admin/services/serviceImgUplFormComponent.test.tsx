import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, ReactWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import ServiceImgUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
// React.Context and State //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockServiceImage, createMockServices } from "../../../../test_helpers/serviceHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("'ServiceImgUplForm' componenent tests", () => {
  let mockServiceData: IServiceData;

  beforeAll(() => {
    mockServiceData= createMockServices(1)[0];
    mockServiceData.images[0] = createMockServiceImage(mockServiceData._id);
  });

  describe("Render tests without any Image data", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(<ServiceImgUplForm />)
    });

    it("Should properly render", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render one '#serviceImgSelectBtn' button", () => {
      const selectButton = wrapper.render().find("#serviceImgSelectBtn");
      expect(selectButton.length).toEqual(1);
    });
    it("Should have an input", () => {
      const input = wrapper.find("input");
      expect(input.length).toEqual(1);
    });
    it("Should NOT render '#serviceImgUplControls", () => {
      const controls = wrapper.find("#productImgUplControls");
      expect(controls.length).toEqual(0);
    });
  });
  
  describe("Render tests with an Image file present", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(<ServiceImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the '#serviceImgUplBtn' button", () => {
      const imgUpoadBtn = wrapper.render().find("#serviceImgUplBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the '#serviceImgCancelBtn' button", () => {
      const imgCanceldBtn = wrapper.render().find("#serviceImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
    it("Should properly handle the '#serviceImgCancelBtn' and render correct local state", () => {
      const imgCancelBtn = wrapper.find("#serviceImgCancelBtn");
      imgCancelBtn.at(0).simulate("click");
      expect(wrapper.render().find("#serviceImgSelectBtn").length).toEqual(1);
      expect(wrapper.render().find("#serviceImgCancelBtn").length).toEqual(0);
      expect(wrapper.render().find("#serviceImgUplBtn").length).toEqual(0);
    });
  });
  // MOCK Successful Image upload tests //
  describe("'#serviceImgUplBtn' functionality and successful upload and local state changes", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      const state = generateCleanState();
      state.serviceState.currentServiceData = mockServiceData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/service_images/${mockServiceData._id}`, {
        status: 200,
        response: {
          responseMsg: "ok",
          updatedService: mockServiceData
        }
      });

      wrapper = mount(
        <TestStateProvider mockState={state}>
          <ServiceImgUplForm />
        </TestStateProvider>
      );
      // mock an image //
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should dispatch the API request, rend 'loader' on '#serviceImgUplBtn'", async () => {
      const promise = Promise.resolve();
      const imgUploadBtn = wrapper.find("#serviceImgUplBtn");
      imgUploadBtn.at(0).simulate("click");
      // clear promises //
      await act( async () => promise);
      const updatedUplButton = wrapper.find(ServiceImgUplForm).find(Button).at(1);
      expect(updatedUplButton.props().loading).toEqual(true);
    });
    it("Should correctly render '#serviceImgSelectBtn'", () => {
      wrapper.update();
      const serviceImgSelectBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgSelectBtn");
      expect(serviceImgSelectBtn.length).toEqual(1);
    });
    it("Should NOT render '#serviceImgRetryBtn'", () => {
      const retryBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgRetryBtn");
      expect(retryBtn.length).toEqual(0);
    });
    it("Should NOT render '#serviceImgUplBtn' button after 'successful' upload", () => {
      const imgUpoadBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgUplBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render '#serviceImgCancelBtn' button after 'successful' upload", () => {
      const cancelBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgCancelBtn");
      expect(cancelBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  describe("'#cancelServiceImgUploadBtn' functionality and a failed upload", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;
    const error = new Error("An error occured");

    beforeAll(() => {
      const state = generateCleanState();
      state.serviceState.currentServiceData = mockServiceData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/service_images/${mockServiceData._id}`, {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <TestStateProvider mockState={state}>
          <ServiceImgUplForm />
        </TestStateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the '#serviceImgUplBtn' API error, render loader", async () => {
      const promise = Promise.resolve();
      const imgUplBtn = wrapper.find("#serviceImgUplBtn");
      imgUplBtn.at(0).simulate("click");
      // loader should be displayed on the #serviceImgUplBtn //
      await act( async () => promise);
      const updatedBtn = wrapper.find(ServiceImgUplForm).find(Button).at(1);
      expect(updatedBtn.props().loading).toEqual(true);
    });
    it("Should render '#serviceImgRetryBtn' after a 'failed' API call", () => {
      const imgRetryBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgRetryBtn");
      expect(imgRetryBtn.length).toEqual(1);
    });
    it("Should render '#serviceImgCancelBtn' after a 'failed' API call", () => {
      const imgCancelBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgCancelBtn");
      expect(imgCancelBtn.length).toEqual(1);
    })
    it("Should NOT render '#serviceImgSelectBtn' after a 'failed' API call", () => {
      const selectImgBtn = wrapper.find(ServiceImgUplForm).render().find("#serviceImgSelectBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    
  });
  // END Mock unsuccessful Image upload tests //
});