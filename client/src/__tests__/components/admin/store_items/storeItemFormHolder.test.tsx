import React from "react"
import { Button, List } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
// component imports //
import StoreItemFormHolder from "../../../../components/admin_components/store_items/forms/StoreItemFormHolder";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";
import StoreItemImageUplForm from "../../../../components/admin_components/store_items/forms/StoreItemImgUplForm";
import StoreItemImgPreviewHolder from "../../../../components/admin_components/store_items/image_preview/StoreItemImgPreviewHolder";
import StoreItemImgPreviewThumb from "../../../../components/admin_components/store_items/image_preview/StoreItemImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockStoreItems, setMockStoreItemState } from "../../../../test_helpers/storeItemHelpers";
import { createMockStores } from "../../../../test_helpers/storeHelpers";

describe("StoreItemFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <StoreItemFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(StoreItemFormHolder)).toMatchSnapshot();
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
  // TEST Form Holder state OPEN - NO Current StoreItem Data //
  describe("Form Holder state OPEN - NO Current StoreItem Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider>
            <StoreItemFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly Mount Form Holder, respond to '#storeItemFormToggleBtn' click", () => {
      const toggleButton = wrapper.find("#storeItemFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper.find(StoreItemFormHolder)).toMatchSnapshot();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreItemImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreItemImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
   // END Form Holder state OPEN - NO Current StoreItem Data //
   // TEST Form Holder state OPEN - WITH Current StoreItem Data - NO IMAGES //
  describe("Form Holder state OPEN - WITH Current StoreItem Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreItemState({ currentStoreItem: true });
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreItemFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.update()
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#storeItemFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(StoreItemFormHolder).render().find('#storeItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render 'StoreItemForm' after toggle click", () => {
      const toggleButton = wrapper.find(StoreItemFormHolder).find("#storeItemFormToggleBtn").at(0);
      toggleButton.simulate("click");
      /// wrapper.update();
      // assert that the StoreItemForm is open //
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.find(StoreItemForm).render().find('#adminStoreItemFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#storeItemFormHolderDetailsHolder'", () => {
      const detailsHolder = wrapper.find(StoreItemFormHolder).render().find("#storeItemFormHolderDetailsHolder");
      expect(detailsHolder.length).toEqual(1);
    });
    it("Should render correct information in '.storeItemFormHolderDetail' <divs>", () => {
      const storeItemDetails = wrapper.find(StoreItemFormHolder).find(".storeItemFormHolderDetail");
      expect(storeItemDetails.length).toEqual(4);
      // assert correct detail rendering //
      const { currentStoreItemData } = state.storeItemState;
      expect(storeItemDetails.at(0).find("p").text()).toEqual(currentStoreItemData.name);
      expect(storeItemDetails.at(1).find("p").text()).toEqual(currentStoreItemData.price);
      expect(storeItemDetails.at(2).find("p").text()).toEqual(currentStoreItemData.description);
      expect(storeItemDetails.at(3).find("p").text()).toEqual(currentStoreItemData.details);
    });
    it("Should render 'StoreItem' 'categories' and correct number of 'categories'", () => {
      const categoriesHolder = wrapper.find(".storeItemFormHolderCategories").find(List);
      const categories = categoriesHolder.find(List.Item);
      const { currentStoreItemData } = state.storeItemState;
      // assert correct rendering //
      expect(categoriesHolder.length).toEqual(1)
      expect(categories.length).toEqual(currentStoreItemData.categories.length);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreItemImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
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
  // END Form Holder state OPEN - WITH Current StoreItem Data - NO IMAGES //
  // TEST Form Holder state OPEN - WITH Current StoreItem Data - WITH IMAGES //
  describe("Form Holder state OPEN - WITH Current StoreItem Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreItemState({ currentStoreItem: true, storeItemImages: 3 });
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <StoreItemFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#storeItemFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render 'StoreItemForm' component after toggle click", () => {
      const toggleButton = wrapper.find(StoreItemFormHolder).find("#storeItemFormToggleBtn").at(0);
      toggleButton.simulate("click");
      // assert correct rendering //
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#storeItemFormHolderDetailsHolder'", () => {
      const detailsHolder = wrapper.find(StoreItemFormHolder).render().find("#storeItemFormHolderDetailsHolder");
      expect(detailsHolder.length).toEqual(1);
    });
    it("Should render correct information in '.storeItemFormHolderDetail' <divs>", () => {
      const storeItemDetails = wrapper.find(StoreItemFormHolder).find(".storeItemFormHolderDetail");
      expect(storeItemDetails.length).toEqual(4);
      // assert correct detail rendering //
      const { currentStoreItemData } = state.storeItemState;
      expect(storeItemDetails.at(0).find("p").text()).toEqual(currentStoreItemData.name);
      expect(storeItemDetails.at(1).find("p").text()).toEqual(currentStoreItemData.price);
      expect(storeItemDetails.at(2).find("p").text()).toEqual(currentStoreItemData.description);
      expect(storeItemDetails.at(3).find("p").text()).toEqual(currentStoreItemData.details);
    });
    it("Should render 'StoreItem' 'categories' and correct number of 'categories'", () => {
      const categoriesHolder = wrapper.find(".storeItemFormHolderCategories").find(List);
      const categories = categoriesHolder.find(List.Item);
      const { currentStoreItemData } = state.storeItemState;
      // assert correct rendering //
      expect(categoriesHolder.length).toEqual(1)
      expect(categories.length).toEqual(currentStoreItemData.categories.length);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreItemImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
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
  // END Form Holder state OPEN - WITH Current StoreItem Data - WITH IMAGES //
  // TEST Form Holder state OPEN - MOCK Submit action //
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      moxios.install();
      // mount and wait for '/api/stores mock API call //
      wrapper = mount(
        <Router initialEntries={["/admin/store_items/create"]} >
          <TestStateProvider>
            <StoreItemFormHolder />
          </TestStateProvider>
        </Router>
        
      );
    
      await act( async () => {
        moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "OK",
            stores: createMockStores(5)
          }
        });
      });
      moxios.uninstall()
    });

    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#storeItemFormToggleBtn").at(0).simulate("click").update();
      const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreate").at(0);
      expect(adminStoreItemFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateStoreItemAction, show 'LoadingBar' Component", async () => {
      moxios.install();
      await act( async () => {
        moxios.stubRequest("/api/store_items/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newStoreItem: createMockStoreItems(1)[0]
          }
        });
        const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreate").at(0);
        adminStoreItemFormCreate.simulate("click");
        //expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      // expect(sinon.spy(createStoreItem)).toHaveBeenCalled()
      wrapper.update();
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'StoreItemForm' Component after successful API call", () => {
      expect(wrapper.find(StoreItemForm).length).toEqual(0);
    });
    // END Form Holder state OPEN - MOCK Submit action //
  });

});