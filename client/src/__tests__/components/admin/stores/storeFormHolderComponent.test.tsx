import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";
// component imports //
import StoreFormHolder from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import StoreImageUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import StoreImgPreviewHolder from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewHolder";
import StoreImgPreviewThumb from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockStores, setMockStoreState } from "../../../../test_helpers/storeHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("StoreFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <StoreFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(StoreFormHolder)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should NOT render '#adminStoreFormHolderDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormHolder).render().find("#adminStoreFormHolderDetails");
      expect(formDetails.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(StoreFormHolder).render().find("#adminStoreFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });

  });
  // TEST Form Holder state OPEN - NO Current Store Data //
  describe("Form Holder state OPEN - NO Current Store Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider>
            <StoreFormHolder />
          </TestStateProvider>
        </Router>
      );
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render '#adminStoreFormHolderDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormHolder).render().find("#adminStoreFormHolderDetails");
      expect(formDetails.length).toEqual(0);
    });
    it("Should Properly Mount Form Holder, respond to '#storeToggleBtn' click", () => {
      const toggleButton = wrapper.find("#adminStoreFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper).toMatchSnapshot();
    });
  
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button click", () => {
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
        <Router keyLength={0}>
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
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should  NOT initially render the 'StoreForm' component after toggle button click", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should render '#adminStoreFormHolderDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormHolder).render().find("#adminStoreFormHolderDetails");
      expect(formDetails.length).toEqual(1);
    });
    it("Should correctly render data in '.adminStoreFormHolderTitle'", () => {
      const detailsTitle = wrapper.find(StoreFormHolder).find('.adminStoreFormHolderTitle');
      const { currentStoreData } = state.storeState;
      expect(detailsTitle.length).toEqual(1);
      expect(detailsTitle.find('p').text()).toEqual(currentStoreData.title);
    });
    it("Should correctly render data in '.adminStoreFormHolderDesc'", () => {
      const detailsDesc = wrapper.find(StoreFormHolder).find('.adminStoreFormHolderDesc');
      const { currentStoreData } = state.storeState;
      // assert correct rendering //
      expect(detailsDesc.length).toEqual(1);
      expect(detailsDesc.find("p").text()).toEqual(currentStoreData.description);
    });
    it("Should render 'StoreForm' component after '#adminStoreFormToggleBtn' click event", () => {
      wrapper.find("#adminStoreFormToggleBtn").at(0).simulate("click");
      wrapper.update();
      expect(wrapper.find(StoreForm).length).toEqual(1);
    })
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
        <Router keyLength={0}>
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
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have the 'StoreForm' component initially rendered", () => {
      expect(wrapper.find(StoreForm).length).toEqual(0)
    });
    it("Should render '#adminStoreFormHolderDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormHolder).render().find("#adminStoreFormHolderDetails");
      expect(formDetails.length).toEqual(1);
    })
    it("Should correctly render data in '.adminStoreFormHolderTitle'", () => {
      const detailsTitle = wrapper.find(StoreFormHolder).find('.adminStoreFormHolderTitle');
      const { currentStoreData } = state.storeState;
      expect(detailsTitle.length).toEqual(1);
      expect(detailsTitle.find('p').text()).toEqual(currentStoreData.title);
    });
    it("Should correctly render data in '.adminStoreFormHolderDesc'", () => {
      const detailsDesc = wrapper.find(StoreFormHolder).find('.adminStoreFormHolderDesc');
      const { currentStoreData } = state.storeState;
      // assert correct rendering //
      expect(detailsDesc.length).toEqual(1);
      expect(detailsDesc.find("p").text()).toEqual(currentStoreData.description);
    });
    it("Should render 'StoreForm' componet after '#adminStoreFormToggleBtn' click event", () => {
      const toggleBtn = wrapper.find(StoreFormHolder).find("#adminStoreFormToggleBtn");
      toggleBtn.at(0).simulate("click");
      // assert correct rendering //
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
      state = generateCleanState();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={[AdminStoreRoutes.EDIT_ROUTE]} keyLength={0} >
          <TestStateProvider mockState={state}>
            <StoreFormHolder />
          </TestStateProvider>
        </Router>
      );
    });
    afterAll(() => {
      moxios.uninstall();
    });
    
    it("Should have a submit button", () => {
      wrapper.find("#adminStoreFormToggleBtn").at(0).simulate("click");
      wrapper.update();
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
        // console.log(wrapper.find(LoadingBar).length);
      });
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