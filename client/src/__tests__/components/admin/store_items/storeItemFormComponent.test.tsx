import React from "react"
import sinon from "sinon";
import { createStoreItem } from "../../../../components/admin_components/store_items/actions/APIStoreItemActions"
import { mount, shallow, ReactWrapper } from "enzyme";
import { Button } from "semantic-ui-react";
// component imports //
import StoreItemFormHolder from "../../../../components/admin_components/store_items/forms/StoreItemFormHolder";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";
import StoreItemImageUplForm from "../../../../components/admin_components/store_items/forms/StoreItemImgUplForm";
import StoreItemImgPreviewHolder from "../../../../components/admin_components/store_items/image_preview/StoreItemImgPreviewHolder";
import StoreItemImgPreviewThumb from "../../../../components/admin_components/store_items/image_preview/StoreItemImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { createMockStoreItems, setMockStoreItemState } from "../../../../test_helpers/storeItemHelpers";
import { IGlobalAppContext, IGlobalAppState, StateProvider } from "../../../../state/Store";
import { act } from "react-dom/test-utils";
import moxios from "moxios";
import { createMockStores } from "../../../../test_helpers/storeHelpers";

const extractContext = (): IGlobalAppContext => {
  type WrapperProps = {
    value: IGlobalAppContext;
  }
  let wrapper = shallow<WrapperProps>(<StateProvider />)
  const { state, dispatch } = wrapper.props().value;
  return {
    state,
    dispatch
  };
}
const ConnectToContext = (component: React.Component): IGlobalAppContext => {
  type WrapperProps = {
    value: IGlobalAppContext;
  }
  let wrapper = shallow<WrapperProps>(<StateProvider />)
  const { state, dispatch } = wrapper.props().value;
  return {
    state,
    dispatch
  };
}
describe("StoreItemFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(<StoreItemFormHolder />);
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    })
  });

  describe("Form Holder state OPEN - NO Current StoreItem Data",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(<StoreItemFormHolder />);
    });

    it("Should Properly Mount Form Holder", () => {
      const toggleButton = wrapper.find("#storeItemFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      expect(wrapper.html()).toBeDefined();

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
  /*
  describe("Form Holder state OPEN - WITH Current StoreItem Data - NO IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreItemState({ currentStoreItem: true });
      wrapper = mount(<StoreItemFormHolder />);
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormUpdate');
      expect(toggleButton.length).toEqual(1);
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
  
  describe("Form Holder state OPEN - WITH Current StoreItem Data - WITH IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreItemState({ currentStoreItem: true, storeItemImages: 3 });
      wrapper = mount(<StoreItemFormHolder />);
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeItemFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreItemForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreItemFormUpdate');
      expect(toggleButton.length).toEqual(1);
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
  */
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      moxios.install();

      wrapper = mount(
        <StateProvider>
          <StoreItemFormHolder />
        </StateProvider>
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
    })
    
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

    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    
    it("Should NOT show the 'StoreItemForm' Component after successful API call", () => {
      act(() => {
        wrapper.update();
      })
      expect(wrapper.find(StoreItemForm).length).toEqual(0);
    });
    
  });

});