import React from "react"
import { Button, Icon } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";
// component imports //
import StoreFormContainer from "../../../../components/admin_components/stores/forms/StoreFormContainer";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import StoreImageUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import StoreImgPreviewContainer from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewContainer";
import StoreImgPreviewThumb from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
import ErrorBar from "../../../../components/admin_components/miscelaneous/ErrorBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockStores, setMockStoreState } from "../../../../test_helpers/storeHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("StoreFormContainer Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Container state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <StoreFormContainer />
        </Router>
      );
    });

    it("Should Properly Mount Form Container", () => {
      expect(wrapper.find(StoreFormContainer)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should NOT render '#adminStoreFormContainerDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
      expect(formDetails.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(StoreFormContainer).render().find("#adminStoreFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });

  });
  // TEST Form Container state OPEN - NO Current Store Data //
  describe("Form Container state OPEN - NO Current Store Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider>
            <StoreFormContainer />
          </TestStateProvider>
        </Router>
      );
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render '#adminStoreFormContainerDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
      expect(formDetails.length).toEqual(0);
    });
    it("Should Properly Mount Form Container, respond to '#storeToggleBtn' click", () => {
      const toggleButton = wrapper.find("#adminStoreFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper).toMatchSnapshot();
    });
  
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormCreateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button click", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
  // END Form Container state OPEN - NO Current Store Data //
  // TEST Form Container state OPEN - WITH Current Store Data - NO IMAGES //
  describe("Form Container state OPEN - WITH Current Store Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true });
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
          </TestStateProvider>
        </Router>
      );
      wrapper.update()
    });

    it("Should Properly Mount Form Container", () => {
      expect(wrapper.find("#storeFormContainer").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should  NOT initially render the 'StoreForm' component after toggle button click", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should render '#adminStoreFormContainerDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
      expect(formDetails.length).toEqual(1);
    });
    it("Should correctly render data in '.adminStoreFormContainerDetailsItem' <div>(s)", () => {
      const detailsDivs = wrapper.find(StoreFormContainer).find('.adminStoreFormContainerDetailsItem');
      const { currentStoreData } = state.storeState;
      expect(detailsDivs.length).toEqual(2);
      expect(detailsDivs.at(0).find('p').text()).toEqual(currentStoreData.title);
      expect(detailsDivs.at(1).find('p').text()).toEqual(currentStoreData.description);
    });
    it("Should render 'StoreForm' component after '#adminStoreFormToggleBtn' click event", () => {
      wrapper.find("#adminStoreFormToggleBtn").at(0).simulate("click");
      wrapper.update();
      expect(wrapper.find(StoreForm).length).toEqual(1);
    })
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
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
  // END Form Container state OPEN - WITH Current Store Data - NO IMAGES //
  // TEST Form Container state OPEN - WITH Current Store Data - WITH IMAGES //
  describe("Form Container state OPEN - WITH Current Store Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true, storeImages: 3 });
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly Mount Form Container", () => {
      expect(wrapper.find("#storeFormContainer").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have the 'StoreForm' component initially rendered", () => {
      expect(wrapper.find(StoreForm).length).toEqual(0)
    });
    it("Should render '#adminStoreFormContainerDetails' 'div'", () => {
      const formDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
      expect(formDetails.length).toEqual(1);
    })
    it("Should correctly render data in '.adminStoreFormContainerDetailsItem' <div>(s)", () => {
      const detailsDivs = wrapper.find(StoreFormContainer).find('.adminStoreFormContainerDetailsItem');
      const { currentStoreData } = state.storeState;
      expect(detailsDivs.length).toEqual(2);
      expect(detailsDivs.at(0).find('p').text()).toEqual(currentStoreData.title);
      expect(detailsDivs.at(1).find('p').text()).toEqual(currentStoreData.description);
    });
    it("Should render 'StoreForm' componet after '#adminStoreFormToggleBtn' click event", () => {
      const toggleBtn = wrapper.find(StoreFormContainer).find("#adminStoreFormToggleBtn");
      toggleBtn.at(0).simulate("click");
      // assert correct rendering //
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
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
  // END Form Container state OPEN - WITH Current Store Data - WITH IMAGES //
  // TEST Form Container state OPEN - MOCK Submit action //
  describe("Form Container state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={[AdminStoreRoutes.EDIT_ROUTE]} keyLength={0} >
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
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
      const adminStoreFormCreate = wrapper.find("#adminStoreFormCreateBtn").at(0);
      expect(adminStoreFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateStoreAction, show 'LoadingBar' Component", async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/stores/create", {
        status: 200,
        response: {
          responseMsg: "All Good",
          newStore: createMockStores(1)[0]
        }
      });
      const adminStoreFormCreate = wrapper.find("#adminStoreFormCreateBtn").at(0);
      // console.log(wrapper.find(StoreFormContainer).debug());
      adminStoreFormCreate.simulate("click");
      await act( async () => promise);
      expect(wrapper.find(LoadingBar).length).toEqual(1);
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      wrapper.update();
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'StoreForm' Component after successful API call", () => {
      expect(wrapper.find(StoreForm).length).toEqual(0);
    });
  });
  // END Form Container state OPEN - MOCK Submit action //
  // TEST StoreFormContainer mock submit action with an API error returned //
  describe("Form Container state OPEN - MOCK Submit action ERROR returned",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;
    let mockStore: IStoreData;
    const error = new Error("Am error occured");

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      const currentStore = mockStore = createMockStores(1)[0];
      state.storeState.currentStoreData = currentStore;
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={[AdminStoreRoutes.EDIT_ROUTE]} keyLength={0} >
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
          </TestStateProvider>
        </Router>
      );
      const toggleBtn = wrapper.find(StoreFormContainer).find("#adminStoreFormToggleBtn");
      toggleBtn.at(0).simulate("click");
    });
    afterAll(() => {
      moxios.uninstall();
    });
    
    it("Should handle the 'handleCreateStoreAction, show 'LoadingBar' Component", async () => {
      const promise = Promise.resolve();
      const url = `/api/stores/update/${mockStore._id}`
      moxios.install();
      moxios.stubRequest(url, {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });
      const adminStoreFormCreate = wrapper.find("#adminStoreFormUpdateBtn").at(0);
      adminStoreFormCreate.simulate("click");
      await act( async () => promise);
      expect(wrapper.find(LoadingBar).length).toEqual(1);
      expect(moxios.requests.mostRecent().url).toEqual(url);
    });
    it("Should NOT render the 'LoadingBar' Component after an error in API call", () => {
      wrapper.update();
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should render the 'ErrorBar' Component after an error in API call", () => {
      expect(wrapper.find(ErrorBar).length).toEqual(1);
    });
    it("Should show the 'StoreForm' Component after an error in API call", () => {
      expect(wrapper.find(StoreForm).length).toEqual(1);
    });
    it("Should properly dissmiss the 'ErrorBar' component with button click", () => {
      const dismissErrorIcon = wrapper.find(StoreFormContainer).find(ErrorBar).find(Icon);
      // simulate the dismissErrorIcon click //
      dismissErrorIcon.simulate("click");
      expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
      expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
    })
  });

  
});