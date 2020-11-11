import React from "react"
import { Button, Icon } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter, Router } from "react-router-dom";
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

describe("'StoreFormContainer' Component tests", () => {
  let wrapper: ReactWrapper; 
  let mockStore: IStoreData;
  const mockDate = new Date("1/1/2019").toString();

  beforeAll(() => {
    mockStore = {
      _id: "1",
      title: "title",
      description: "description",
      images: [],
      createdAt: mockDate
    };
  });

  describe("Default 'StoreFormContainer' state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <StoreFormContainer />
        </MemoryRouter>
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
  describe(" 'StoreFormContainer' with 'StoreForm' state OPEN - NO Current Store Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider>
            <StoreFormContainer />
          </TestStateProvider>
        </MemoryRouter>
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
      state = generateCleanState();
      state.storeState.currentStoreData = mockStore;
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
      wrapper.update()
    });

    it("Should Properly render Form Container", () => {
      expect(wrapper.find(StoreFormContainer).find("#storeFormContainer").length).toEqual(1);
    });
    it("Should have a 'StoreForm' toggle Button", () => {
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
      state = generateCleanState();
      mockStore.images = [
        {
          _id: "1",
          description: "description",
          url: "url",
          absolutePath: "path",
          fileName: "img",
          imagePath: "imgPath",
          createdAt: mockDate
        },
        {
          _id: "2",
          description: "description two",
          url: "url",
          absolutePath: "path",
          fileName: "img",
          imagePath: "imgPath",
          createdAt: mockDate
        }
      ];
      state.storeState.currentStoreData = mockStore;
      // mount component and set state //
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
    });

    it("Should render 'StoreFormContainer' component", () => {
      expect(wrapper.find(StoreFormContainer).find("#storeFormContainer").length).toEqual(1);
    });
    it("Should have a 'StoreForm' toggle Button", () => {
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
  // TEST Form Container state OPEN - NEW FORM - MOCK Submit action //
  describe("'StoreFormContainer' 'StoreForm' OPEN - -NEW FORM - mock Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    // TEST 'StoreFormContainer' NEW FORM mock SUBMIT SUCCESS //
    describe("'StoreFormContainer' 'StoreForm' OPEN - NEW FORM - mock SUBMIT SUCCESS", () => {

      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[AdminStoreRoutes.CREATE_ROUTE]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <StoreFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });
      
      it("Should have a submit button", () => {
        wrapper.find("#adminStoreFormToggleBtn").at(0).simulate("click");
        wrapper.update();
        // set mock values //
        const storeTitleInput = wrapper.find(StoreForm).find("#adminStoreFormTitleInput");
        const storeDescInput = wrapper.find(StoreForm).find("#adminStoreFormDescInput");
        // simulte input //
        storeTitleInput.simulate("change", { target: { value: mockStore.title } });
        storeDescInput.at(1).simulate("change", { target: { value: mockStore.description } });
        // assert correct rendering //
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
            newStore: mockStore
          }
        });
        const adminStoreFormCreate = wrapper.find("#adminStoreFormCreateBtn").at(0);
        adminStoreFormCreate.simulate("click");

        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
        wrapper.update();
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'StoreForm' Component after successful API call", () => {
        expect(wrapper.find(StoreForm).length).toEqual(0);
      });
      it("Shohuld correctly render '#adminStoreFormContainerDetails' 'Grid' item", () => {
        const storeDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
        expect(storeDetails.length).toEqual(1);
      });
      it("Should render correct values in '#adminStoreFormContainerDetails'", () => {
        const detailsContainers = wrapper.find(StoreFormContainer).find(".adminStoreFormContainerDetailsItem");
        expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockStore.title);
        expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockStore.description);
      });
      it(`Should NOT change the client route: ${AdminStoreRoutes.CREATE_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.CREATE_ROUTE);
      });
    });
    // END TEST 'StoreFormContainer' NEW FORM mock SUBMIT SUCCESS //
    // TEST 'StoreFormContainer' NEW FORM mock SUBMIT ERROR //
    describe("'StoreFormContainer' 'StoreForm' state OPEN - NEW FORM - MOCK Submit action ERROR returned",  () => {
      let wrapper: ReactWrapper;
      const error = new Error("Am error occured");
  
      beforeAll( async () => {
        window.scrollTo = jest.fn();
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminStoreRoutes.CREATE_ROUTE ]} keyLength={0} >
            <TestStateProvider>
              <StoreFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
        // set form values //
      });
      afterAll(() => {
        moxios.uninstall();
      });

      it("Should render 'StoreForm' and the submit button", () => {
        const toggleBtn = wrapper.find(StoreFormContainer).find("#adminStoreFormToggleBtn");
        toggleBtn.at(0).simulate("click");
        // set mock values //
        const storeTitleInput = wrapper.find(StoreForm).find("#adminStoreFormTitleInput");
        const storeDescInput = wrapper.find(StoreForm).find("#adminStoreFormDescInput");
        // simulte input //
        storeTitleInput.simulate("change", { target: { value: mockStore.title } });
        storeDescInput.at(1).simulate("change", { target: { value: mockStore.description } });
        // assert correct rendering //
        const adminStoreFormCreate = wrapper.find("#adminStoreFormCreateBtn").at(0);
        expect(adminStoreFormCreate.length).toEqual(1)
      })
      
      it("Should handle the 'handleCreateStoreAction', show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        const url = `/api/stores/create`
        moxios.install();
        moxios.stubRequest(url, {
          status: 500,
          response: {
            responseMsg: "Error",
            error: error
          }
        });
        const adminStoreFormCreate = wrapper.find("#adminStoreFormCreateBtn").at(0);
        adminStoreFormCreate.simulate("click");

        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
        expect(moxios.requests.mostRecent().url).toEqual(url);
      });
      it("Should NOT render the 'LoadingBar' Component after an error in API call", () => {
        wrapper.update();
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should render the 'ErrorBar' Component after an error in API call", () => {
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(1);
      });
      it("Should show the 'StoreForm' Component after an error in API call", () => {
        expect(wrapper.find(StoreForm).length).toEqual(1);
      });
      it("Should NOT render the '#adminStoreFormContainerDetails' <div>", () => {
        expect(wrapper.find(StoreFormContainer).find("#adminStoreFormContainerDetails").length).toEqual(0);
      });
      it("Should properly dissmiss the 'ErrorBar' component with button click", () => {
        const dismissErrorIcon = wrapper.find(StoreFormContainer).find(ErrorBar).find(Icon);
        // simulate the dismissErrorIcon click //
        dismissErrorIcon.simulate("click");
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should NOT reset input values of 'StoreForm' inputs", () => {
        const titleInput = wrapper.find(StoreForm).find("#adminStoreFormTitleInput");
        const descInput = wrapper.find(StoreForm).find("#adminStoreFormDescInput");
        // assert correct rendering //
        expect(titleInput.props().value).toEqual(mockStore.title);
        expect(descInput.at(1).props().value).toEqual(mockStore.description);
      });
      it(`Should NOT change the client route: ${AdminStoreRoutes.CREATE_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.CREATE_ROUTE);
      });
    
    });
    // END TEST StoreFormContainer mock submit action with an API error returned //
  });
  // END Form Container state OPEN - NEW FORM - MOCK Submit action //
  // TEST Form Container state OPEN - CURRENT STORE DATA - MOCK Submit action //
  describe("'StoreFormContainer' 'StoreForm' OPEN - CURRENT STORE DATA - mock Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    // TEST 'StoreFormContainer' NEW FORM mock SUBMIT SUCCESS //
    describe("'StoreFormContainer' 'StoreForm' OPEN - NEW FORM - mock SUBMIT SUCCESS", () => {

      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        state.storeState.currentStoreData = { ...mockStore };
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminStoreRoutes.EDIT_ROUTE ]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <StoreFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });
      
      it("Should have a '#adminStoreFormUpdateBtn' button", () => {
        wrapper.find("#adminStoreFormToggleBtn").at(0).simulate("click");
        const adminStoreFormUpdate = wrapper.find("#adminStoreFormUpdateBtn").at(0);
        expect(adminStoreFormUpdate.length).toEqual(1)
      });
      
      it("Should handle the 'handleUpdateStoreAction' show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest(`/api/stores/update/${mockStore._id}`, {
          status: 200,
          response: {
            responseMsg: "All Good",
            editedStore: mockStore
          }
        });
        const adminStoreFormUpdate = wrapper.find("#adminStoreFormUpdateBtn").at(0);
        adminStoreFormUpdate.simulate("click");
        
        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
        
      });
    
      it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
        wrapper.update();
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'StoreForm' Component after successful API call", () => {
        expect(wrapper.find(StoreForm).length).toEqual(0);
      });
      it("Shohuld correctly render '#adminStoreFormContainerDetails' 'Grid' item", () => {
        const storeDetails = wrapper.find(StoreFormContainer).render().find("#adminStoreFormContainerDetails");
        expect(storeDetails.length).toEqual(1);
      });
      it("Should render correct values in '#adminStoreFormContainerDetails'", () => {
        const detailsContainers = wrapper.find(StoreFormContainer).find(".adminStoreFormContainerDetailsItem");
        expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockStore.title);
        expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockStore.description);
      });
      it(`Should NOT change the client route: ${AdminStoreRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.EDIT_ROUTE);
      });
    
    });
    // END TEST 'StoreFormContainer' CURRENT_STORE_DATA mock SUBMIT SUCCESS //
    // TEST 'StoreFormContainer' CURRENT_STORE_DATA mock SUBMIT ERROR //
    describe("'StoreFormContainer' 'StoreForm' state OPEN - CURRENT_STORE_DATA - MOCK Submit action ERROR returned",  () => {
      let wrapper: ReactWrapper; let state: IGlobalAppState;
      const error = new Error("Am error occured");
  
      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        state.storeState.currentStoreData = { ...mockStore }
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminStoreRoutes.EDIT_ROUTE ]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <StoreFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
        // set form values //
      });
      afterAll(() => {
        moxios.uninstall();
      });

      it("Should render 'StoreForm' and the submit button", () => {
        const toggleBtn = wrapper.find(StoreFormContainer).find("#adminStoreFormToggleBtn");
        toggleBtn.at(0).simulate("click");
        // assert correct rendering //
        const adminStoreFormCreate = wrapper.find("#adminStoreFormUpdateBtn").at(0);
        expect(adminStoreFormCreate.length).toEqual(1)
      })
      
      it("Should handle the 'handleUpdateStoreAction' show 'LoadingBar' Component", async () => {
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
        // assert correct rendering //
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
        expect(moxios.requests.mostRecent().url).toEqual(url);
      });
      it("Should NOT render the 'LoadingBar' Component after an error in API call", () => {
        wrapper.update();
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should render the 'ErrorBar' Component after an error in API call", () => {
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(1);
      });
      it("Should show the 'StoreForm' Component after an error in API call", () => {
        expect(wrapper.find(StoreForm).length).toEqual(1);
      });
      it("Should render the '#adminStoreFormContainerDetails' <div>", () => {
        expect(wrapper.find(StoreFormContainer).find("#adminStoreFormContainerDetails").length).toEqual(1);
      });
      it("Should render correct data in the '#adminStorFormContainerDetails <div>", () => {
        const detailsItems = wrapper.find(StoreFormContainer).find(".adminStoreFormContainerDetailsItem");
        expect(detailsItems.length).toEqual(2);
        expect(detailsItems.at(0).find("p").render().html()).toEqual(mockStore.title);
        expect(detailsItems.at(1).find("p").render().html()).toEqual(mockStore.description);
      });
      it("Should properly dissmiss the 'ErrorBar' component with button click", () => {
        const dismissErrorIcon = wrapper.find(StoreFormContainer).find(ErrorBar).find(Icon);
        // simulate the dismissErrorIcon click //
        dismissErrorIcon.simulate("click");
        expect(wrapper.find(StoreFormContainer).find(ErrorBar).length).toEqual(0);
        expect(wrapper.find(StoreFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should NOT reset input values of 'StoreForm' inputs", () => {
        const titleInput = wrapper.find(StoreForm).find("#adminStoreFormTitleInput");
        const descInput = wrapper.find(StoreForm).find("#adminStoreFormDescInput");
        // assert correct rendering //
        expect(titleInput.props().value).toEqual(mockStore.title);
        expect(descInput.at(1).props().value).toEqual(mockStore.description);
      });
      it(`Should NOT change the client route: ${AdminStoreRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.EDIT_ROUTE);
      });
    
    });
    // END TEST StoreFormContainer mock submit action with an API error returned //
  });
  // TEST Form Container state OPEN - CURRENT STORE DATA - MOCK Submit action //
  
});