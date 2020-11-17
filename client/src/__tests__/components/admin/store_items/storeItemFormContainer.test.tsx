import React from "react"
import { Button, Icon, List, Message, MessageItem } from "semantic-ui-react";
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
import FormErrorComponent from "../../../../components/admin_components/popups/FormErrorComponent";
import { ConvertDate } from "../../../../components/helpers/displayHelpers"

describe("'StoreItemFormContainer' Component tests", () => {
  let wrapper: ReactWrapper; 
  let mockStoreItem: IStoreItemData;
  let mockStores: IStoreData[];
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
  mockStores = createMockStores(5);
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
  /*
  describe("Form Container state OPEN - NEW FORM - MOCK Submit action",  () => {
    let wrapper: ReactWrapper;
    
    // TEST Form Container state OPEN - NEW FORM - MOCK Submit action success //
    describe("'StoreItemFormContainer' - NEW FORM - SUBMIT SUCCESS", () => {
      beforeAll( async () => {
        const promise = Promise.resolve();
  
        window.scrollTo = jest.fn();
        moxios.install();
        moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "OK",
            stores: mockStores
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
      it("Should correctly render #'storeItemFormContainerDetails' component, correctly render data", () => {
        const detailsContainer = wrapper.find(StoreItemFormContainer).find("#storeItemFormContainerDetails");
        const detailsDivs = wrapper.find(StoreItemFormContainer).find(".storeItemFormContainerDetailsItem");
        // assert correct rendering //
        expect(detailsContainer.length).toEqual(1);
        expect(detailsDivs.length).toEqual(4);
        expect(detailsDivs.at(0).find("p").render().text()).toEqual(mockStoreItem.name);
        expect(detailsDivs.at(1).find("p").render().text()).toEqual(mockStoreItem.price);
        expect(detailsDivs.at(2).find("p").render().text()).toEqual(mockStoreItem.description);
        expect(detailsDivs.at(3).find("p").render().text()).toEqual(mockStoreItem.details);
      });
      it("Should NOT render any error messages in 'FormErrorComponent'", () => {
        const errorComp = wrapper.find(StoreItemFormContainer).find(FormErrorComponent).find("#formErrorComponentHolder");
        expect(errorComp.length).toEqual(0);
      })
    });  
    // END TEST Form Container state OPEN - NEW FORM - MOCK Submit action  SUCCESS //
    // TEST Form Container state OPEN - NEW FORM - MOCK Submit action FAILURE //
    describe("'StoreItemFormContainer' - NEW FORM - SUBMIT FAILURE", () => {
      const error = new Error("An API error occured");

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
          status: 500,
          response: {
            responseMsg: "An error occured",
            error: error,
            messages: [ error.message ]
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
        wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormToggleBtn").at(0).simulate("click");
        // set mock values //
        const storeItemNameInput = wrapper.find(StoreItemForm).find("#adminStoreItemFormNameInput");
        const storeItemPriceInput = wrapper.find(StoreItemForm).find("#adminStoreItemFormPriceInput");
        const storeItemDescInput = wrapper.find(StoreItemForm).find("#adminStoreItemFormDescInput");
        const storeItemDetailsInput = wrapper.find(StoreItemForm).find("#adminStoreItemFormDetailsInput");
        // input change simulate //
        storeItemNameInput.simulate("change", { target: { value: mockStoreItem.name } });
        storeItemPriceInput.simulate("change", { target: { value: mockStoreItem.price } });
        storeItemDescInput.at(1).simulate("change", { target: { value: mockStoreItem.description } });
        storeItemDetailsInput.at(1).simulate("change", { target: { value: mockStoreItem.details } });
      });

      it("Should have a submit button", () => {
        const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreateBtn").at(0);
        expect(adminStoreItemFormCreate.length).toEqual(1)
      });
      it("Should handle the 'handleCreateStoreItemAction, show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        moxios.install();
        
        const adminStoreItemFormCreate = wrapper.find("#adminStoreItemFormCreateBtn").at(0);
        adminStoreItemFormCreate.at(0).simulate("click");
        // wait and assert //
        await act( async () => promise);
        expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      it("Should NOT render the 'LoadingBar' Component after an error in API call", () => {
        wrapper.update();
        expect(wrapper.find(LoadingBar).length).toEqual(0);
      });
      it("Should correctly render the 'FormErrorComponent' component after an error in API call", () => {
        const formErrorComp = wrapper.find(StoreItemFormContainer).find(FormErrorComponent).find(Message)
        expect(formErrorComp.length).toEqual(1);
        expect(formErrorComp.find(MessageItem).length).toEqual(1);
        expect(formErrorComp.find(MessageItem).props().content).toEqual(error.message);
      });
      it("Should correctly dismiss the 'FormErrorComponent' component after an error in API call", () => {
        const formErrorCompDismiss = wrapper.find(StoreItemFormContainer).find(FormErrorComponent).find(Message).find(Icon).find("i");
        formErrorCompDismiss.simulate("click");
        wrapper.update();
        // assert correct rendering //
        expect(wrapper.find(StoreItemFormContainer).find(FormErrorComponent).length).toEqual(0);
        expect(wrapper.find(StoreItemFormContainer).find(LoadingBar).length).toEqual(0);
      });
    });
    // TEST Form Container state OPEN - NEW FORM - MOCK Submit action FAILURE //
  });
  // END Form Container state OPEN - NEW FORM - MOCK Submit action //
  */
  // TEST Form Container state OPEN - CURRENT_STORE_ITEM_DATA - MOCK Submit action //
  describe("'StoreItemFormContainer' - CURRENT STORE ITEM DATA - MOCK Submit action", () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;
    const editDate: string = new Date("1/2/2019").toString();
    let storeAPIUrl: string;
    let storeItemUpdUrl: string;

    // TEST Form Container state OPEN - CURRENT STORE_ITEM_DATA - MOCK Submit action success //
    describe("'StoreItemFormContainer - CURRENT STORE ITEM DATA - Mock SUBMIT action success", () => {

      beforeAll( async () => {
        // 'AdminStoreItemFormContainer' has an API call to /stores //
        // mock functions //
        window.scrollTo = jest.fn;
        const promise = Promise.resolve();
        state = generateCleanState();
        state.storeItemState.currentStoreItemData = { ...mockStoreItem };
        mockStoreItem.description = "edited description";
        mockStoreItem.editedAt = editDate;
        // urls //
        storeAPIUrl = "/api/stores";
        storeItemUpdUrl = `/api/store_items/update/${mockStoreItem._id}`
        // mock api calls //
        moxios.install();
        moxios.stubRequest(storeAPIUrl, {
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: mockStores
          }
        });
        moxios.stubRequest(storeItemUpdUrl,  {
          status: 200,
          response: {
            responseMsg: "All ok",
            editedStoreItem: mockStoreItem
          }
        });
        // mount and wait //
        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[ AdminStoreItemRoutes.EDIT_ROUTE ]}>
            <TestStateProvider mockState={state}>
              <StoreItemFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );

        await act( async () => promise);

        const toggleBtn = wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormToggleBtn");
        toggleBtn.at(0).simulate("click");
      });

      it("Should correctly render and respond to 'adminStoreItemFormUpdateBtn' click action",  async () => {
        const promise = Promise.resolve();
        wrapper.update();
        const updateBtn = wrapper.find(StoreItemFormContainer).find("#adminStoreItemFormUpdateBtn");
        // simulate update click //
        updateBtn.at(0).simulate("click");
        await act( async () => promise);
        // asser correct rendering //
        expect(wrapper.find(StoreItemFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(StoreItemFormContainer).find(FormErrorComponent).length).toEqual(0);
      });
      it("Should NOT render 'LoadingBar' component after 'successful' response", () => {
        wrapper.update();
        // assert correct rendering //
        expect(wrapper.find(StoreItemFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(StoreItemFormContainer).find(FormErrorComponent).length).toEqual(0);
      });
      it("Should correctly render the '#storeItemFormContainerDetails' component", () => {
        const formContDetails = wrapper.find(StoreItemFormContainer).find("#storeItemFormContainerDetails");
        const formContDetailsItems = wrapper.find(StoreItemFormContainer).find(".storeItemFormContainerDetailsItem");
        // assert correct rendering //
        expect(formContDetails.length).toEqual(1);
        expect(formContDetailsItems.length).toEqual(4);
        // assert correct data //
        expect(formContDetailsItems.at(0).find("p").render().text()).toEqual(mockStoreItem.name);
        expect(formContDetailsItems.at(1).find("p").render().text()).toEqual(mockStoreItem.price);
        expect(formContDetailsItems.at(2).find("p").render().text()).toEqual(mockStoreItem.description);
        expect(formContDetailsItems.at(3).find("p").render().text()).toEqual(mockStoreItem.details);
      });
      it("Should correctly render timestamps", () => {
        const timestamps = wrapper.find(StoreItemFormContainer).find(".storeItemFormContainerTimestamps").find("span");
        // assert correct rendering //
        expect(timestamps.at(0).find("strong").render().text()).toEqual(ConvertDate.international(mockStoreItem.createdAt));
        expect(timestamps.at(1).find("strong").render().text()).toEqual(ConvertDate.international(mockStoreItem.editedAt));
      });
      it(`Should NOT change the client route: ${AdminStoreItemRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(moxios.requests.mostRecent().url).toEqual(storeItemUpdUrl);
        expect(history.location.pathname).toEqual(AdminStoreItemRoutes.EDIT_ROUTE);
      });
      it("Should NOT render the 'StoreItemForm' component", () => {
        expect(wrapper.find(StoreItemFormContainer).find(StoreItemForm).length).toEqual(0);
      });
    });
    // END TEST Form Container state OPEN - CURRENT STORE_ITEM DATA - MOCK Submit action success //
    // TEST Form Container state OPEN - CURRENT STORE_ITEM DATA - MOCK Submit action failure //
    // END TEST Form Container state OPEN - CURRENT STORE_ITEM DATA - MOCK Submit action failure //

  })
  // END TEST Form Container state OPEN - CURRENT_STORE_ITEM_DATA - MOCK Submit action //

});