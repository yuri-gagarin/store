import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
// component imports //
import StoreFormHolder from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import StoreImageUplForm from "../../../../components/admin_components/stores/forms/StoreImgUplForm";
import StoreImgPreviewHolder from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewHolder";
import StoreImgPreviewThumb from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewThumbs";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, StateProvider, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockStores, setMockStoreState } from "../../../../test_helpers/storeHelpers";

describe("StoreFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router>
          <StoreFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    });

  });
  // TEST Form Holder state OPEN - NO Current Store Data //
  describe("Form Holder state OPEN - NO Current Store Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router>
          <StateProvider>
            <StoreFormHolder />
          </StateProvider>
        </Router>
      );
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should Properly Mount Form Holder, respond to '#storeToggleBtn' click", () => {
      const toggleButton = wrapper.find("#storeFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper).toMatchSnapshot();
    });
  
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
  // END Form Holder state OPEN - NO Current Store Data //
  // TEST Form Holder state OPEN - WITH Current Store Data - NO IMAGES //
  describe("Form Holder state OPEN - WITH Current Store Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true });
      wrapper = mount(
        <Router>
          <TestStateProvider mockState={state}>
            <StoreFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.update()
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#storeFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(StoreImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  // END Form Holder state OPEN - WITH Current Store Data - NO IMAGES //
  // TEST Form Holder state OPEN - WITH Current Store Data - WITH IMAGES //
  describe("Form Holder state OPEN - WITH Current Store Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true, storeImages: 3 });
      wrapper = mount(
        <Router>
          <TestStateProvider mockState={state}>
            <StoreFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#storeFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should render a correct number of preview images", () => {
      const previewThumb = wrapper.find(StoreImgPreviewThumb);
      const numberOfImages = state.storeState.currentStoreData.images.length;
      expect(previewThumb.length).toEqual(numberOfImages);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  // END Form Holder state OPEN - WITH Current Store Data - WITH IMAGES //
  // TEST Form Holder state OPEN - MOCK Submit action //
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={["/admin/stores/create"]} >
          <TestStateProvider>
            <StoreFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#storeFormToggleBtn").at(0).simulate("click").update();
      const adminStoreFormCreate = wrapper.find("#adminStoreFormCreate").at(0);
      expect(adminStoreFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateStoreAction, show 'LoadingBar' Component", async () => {
      moxios.install();
      await act( async () => {
        moxios.stubRequest("/api/stores/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newStore: createMockStores(1)[0]
          }
        });
        const adminStoreFormCreate = wrapper.find("#adminStoreFormCreate").at(0);
        adminStoreFormCreate.simulate("click");
        //expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      // expect(sinon.spy(createStore)).toHaveBeenCalled()
      wrapper.update();
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'StoreForm' Component after successful API call", () => {
      expect(wrapper.find(StoreForm).length).toEqual(0);
    });
    // END Form Holder state OPEN - MOCK Submit action //
  });
  
});