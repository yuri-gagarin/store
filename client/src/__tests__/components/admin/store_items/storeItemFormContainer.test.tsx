import React from "react"
import { Button, List } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter, Router } from "react-router-dom";
// component imports //
import StoreItemFormContainer from "../../../../components/admin_components/store_items/forms/StoreItemFormContainer";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";
import StoreItemImageUplForm from "../../../../components/admin_components/store_items/forms/StoreItemImgUplForm";
import StoreItemImgPreviewContainer from "../../../../components/admin_components/store_items/image_preview/StoreItemImgPreviewContainer";
import StoreItemImgPreviewThumb from "../../../../components/admin_components/store_items/image_preview/StoreItemImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockStoreItems, setMockStoreItemState } from "../../../../test_helpers/storeItemHelpers";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("'StoreItemFormContainer' Component tests", () => {
  let wrapper: ReactWrapper; 
  let mockStoreItem: IStoreItemData;
  const mockDate: string = new Date("1/1/2019").toString();

  beforeAll(() => {
    mockStoreItem = {
      _id: "1",
      storeId: "11",
      storeName: "store",
      name: "name",
      price: "100",
      description: "description",
      details: "details",
      categories: ["sports", "outdoors"],
      images: [],
      createdAt: mockDate
    };
  });
  /*
  describe("Default 'StoreItemFormContainer' state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <StoreItemFormContainer />
        </MemoryRouter>
      );
    });

    it("Should Properly Mount Form Container", () => {
      expect(wrapper.find(StoreItemFormContainer)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    });

  });
  // TEST Form Container state OPEN - NO Current StoreItem Data //
  describe("Form Container state OPEN - NO Current StoreItem Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider>
            <StoreItemFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
    });

    it("Should render 'StoreItemFormContainer', respond to '#adminStoreItemFormToggleBtn' click", () => {
      const toggleButton = wrapper.find("#adminStoreItemFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      expect(wrapper.find(StoreItemFormContainer)).toMatchSnapshot();
    });
    it("Should have a 'SttoreItemForm' toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a '#adminStoreItemFormCreateBtn' Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormCreateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the 'StoreItemForm' rendered after toggle button", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreItemImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreItemImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
   // END Form Container state OPEN - NO Current StoreItem Data //
   // TEST Form Container state OPEN - WITH Current StoreItem Data - NO IMAGES //
  describe("'StoreItemFormContainer' 'StoreItemForm' OPEN - WITH Current StoreItem Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      state.storeItemState.currentStoreItemData = { ...mockStoreItem }
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminStoreItemRoutes.EDIT_ROUTE ]}>
          <TestStateProvider mockState={state}>
            <StoreItemFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
      wrapper.update()
    });

    it("Should properly render '#adminStoreItemFormContainer'", () => {
      expect(wrapper.find("#adminStoreItemFormContainer").length).toEqual(1);
    });
    it("Should have a 'StoreItemForm' toggle Button", () => {
      const toggleButton = wrapper.find(StoreItemFormContainer).render().find('#adminStoreItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render 'StoreItemForm' after toggle click", () => {
      const toggleButton = wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormToggleBtn");
      toggleButton.at(0).simulate("click");
      /// wrapper.update();
      // assert that the StoreItemForm is open //
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a '#adminStoreItemFormUpdateBtn' Button", () => {
      const toggleButton = wrapper.find(StoreItemForm).render().find('#adminStoreItemFormUpdateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#storeItemFormContainerDetails'", () => {
      const detailsContainer = wrapper.find(StoreItemFormContainer).render().find("#storeItemFormContainerDetails");
      expect(detailsContainer.length).toEqual(1);
    });
    it("Should render correct information in '.storeItemFormContainerDetailsItem' <divs>", () => {
      const storeItemDetails = wrapper.find(StoreItemFormContainer).find(".storeItemFormContainerDetailsItem");
      expect(storeItemDetails.length).toEqual(4);
      // assert correct detail rendering //
      const { currentStoreItemData } = state.storeItemState;
      expect(storeItemDetails.at(0).find("p").text()).toEqual(currentStoreItemData.name);
      expect(storeItemDetails.at(1).find("p").text()).toEqual(currentStoreItemData.price);
      expect(storeItemDetails.at(2).find("p").text()).toEqual(currentStoreItemData.description);
      expect(storeItemDetails.at(3).find("p").text()).toEqual(currentStoreItemData.details);
    });
    it("Should render 'StoreItem' 'categories' and correct number of 'categories'", () => {
      const categoriesContainer = wrapper.find(".storeItemFormContainerCategories").find(List);
      const categories = categoriesContainer.find(List.Item);
      const { currentStoreItemData } = state.storeItemState;
      // assert correct rendering //
      expect(categoriesContainer.length).toEqual(1)
      expect(categories.length).toEqual(currentStoreItemData.categories.length);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreItemImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(StoreItemImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreItemImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  // END Form Container state OPEN - WITH Current StoreItem Data - NO IMAGES //
  // TEST Form Container state OPEN - WITH Current StoreItem Data - WITH IMAGES //
  describe("'StoreItemFormContainer' 'StoreItemForm' state OPEN - WITH Current StoreItem Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      mockStoreItem.images = [
        {
          _id: "1",
          url: "url",
          imagePath: "image path",
          absolutePath: "absolute path",
          fileName: "filename",
          createdAt: mockDate
        },
        {
          _id: "2",
          url: "url",
          imagePath: "image path",
          absolutePath: "absolute path",
          fileName: "filename",
          createdAt: mockDate
        }
      ];
      state.storeItemState.currentStoreItemData = { ...mockStoreItem };
      // mount //
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreItemFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
    });

    it("Should properly render 'StoreItemFormContainer'", () => {
      expect(wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormContainer").length).toEqual(1);
    });
    it("Should have a 'StoreItemForm' toggle Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render 'StoreItemForm' component after toggle click", () => {
      const toggleButton = wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormToggleBtn").at(0);
      toggleButton.simulate("click");
      // assert correct rendering //
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a '#adminStoreItemFormUpdateBtn' Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormUpdateBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#storeItemFormContainerDetails'", () => {
      const detailsContainer = wrapper.find(StoreItemFormContainer).render().find("#storeItemFormContainerDetails");
      expect(detailsContainer.length).toEqual(1);
    });
    it("Should render correct information in '.storeItemFormContainerDetailsItem' <divs>", () => {
      const storeItemDetails = wrapper.find(StoreItemFormContainer).find(".storeItemFormContainerDetailsItem");
      expect(storeItemDetails.length).toEqual(4);
      // assert correct detail rendering //
      const { currentStoreItemData } = state.storeItemState;
      expect(storeItemDetails.at(0).find("p").text()).toEqual(currentStoreItemData.name);
      expect(storeItemDetails.at(1).find("p").text()).toEqual(currentStoreItemData.price);
      expect(storeItemDetails.at(2).find("p").text()).toEqual(currentStoreItemData.description);
      expect(storeItemDetails.at(3).find("p").text()).toEqual(currentStoreItemData.details);
    });
    it("Should render 'StoreItem' 'categories' and correct number of 'categories'", () => {
      const categoriesContainer = wrapper.find(".storeItemFormContainerCategories").find(List);
      const categories = categoriesContainer.find(List.Item);
      const { currentStoreItemData } = state.storeItemState;
      // assert correct rendering //
      expect(categoriesContainer.length).toEqual(1)
      expect(categories.length).toEqual(currentStoreItemData.categories.length);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(StoreItemImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
    });
    it("Should render a correct number of preview images", () => {
      const previewThumb = wrapper.find(StoreItemImgPreviewThumb);
      const numberOfImages = state.storeItemState.currentStoreItemData.images.length;
      expect(previewThumb.length).toEqual(numberOfImages);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreItemImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  */
  // END Form Container state OPEN - WITH Current StoreItem Data - WITH IMAGES //
  // TEST Form Container state OPEN - NEW FORM - MOCK Submit action //
  describe("Form Container state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();

      window.scrollTo = jest.fn();
      moxios.install();
      moxios.stubRequest("/api/stores", {
        status: 200,
        response: {
          responseMsg: "OK",
          stores: createMockStores(5)
        }
      });
      moxios.stubRequest("/api/store_items/create", {
        status: 200,
        response: {
          responseMsg: "All Good",
          newStoreItem: mockStoreItem
        }
      });
      // mount and wait for '/api/stores mock API call //
      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminStoreItemRoutes.CREATE_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <StoreItemFormContainer />
          </TestStateProvider>
        </MemoryRouter>
        
      );
      await act( async() => promise);
      wrapper.update();
    });
    afterAll(() => {
      moxios.uninstall();
    })
    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#adminStoreItemFormToggleBtn").at(0).simulate("click");
      const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreateBtn").at(0);
      expect(adminStoreItemFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateStoreItemAction, show 'LoadingBar' Component", async () => {
      const promise = Promise.resolve();
      moxios.install();
      
      const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreateBtn").at(0);
      adminStoreItemFormCreate.at(0).simulate("click");
      //expect(wrapper.find(LoadingBar).length).toEqual(1);
      // expect(sinon.spy(createStoreItem)).toHaveBeenCalled()
      await act( async () => promise);
      expect(wrapper.find(LoadingBar).length).toEqual(1);
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      wrapper.update();
     // console.log(wrapper.find(StoreItemFormContainer).debug())
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'StoreItemForm' Component after successful API call", () => {
      expect(wrapper.find(StoreItemForm).length).toEqual(0);
    });
    // END Form Container state OPEN - MOCK Submit action //
  });

});