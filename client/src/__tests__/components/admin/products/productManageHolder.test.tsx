import React from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
// components //
import ProductsManageHolder from "../../../../components/admin_components/products/product_manage/ProductsManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ProductCard from "../../../../components/admin_components/products/product_manage/ProductCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import ProductFormHolder from "../../../../components/admin_components/products/forms/ProductFormHolder";
import ProductForm from "../../../../components/admin_components/products/forms/ProductForm";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("Product Manage Holder Tests", () => {
  const createdDate: string = new Date("12/31/2019").toString();
  let products: IProductData[];
  
  beforeAll(() => {
    products = [
      {
        _id: "1",
        name: "name",
        price: "100",
        details: "details",
        description: "description",
        images: [],
        createdAt: createdDate
      },
      {
        _id: "2",
        name: "name",
        price: "200",
        details: "details",
        description: "description",
        images: [],
        createdAt: createdDate
      }
    ];
  });
  
  describe("Default Component state at first render", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: []
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminProductRoutes.MANAGE_ROUTE]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
      loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1)
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the 'ProductsManageHolder' component 'Grid'", () => {
      const productsManageGrid = wrapper.find(ProductsManageHolder).find(Grid);
      expect(productsManageGrid.length).toEqual(0);
    });
  });
  
  //
  // TEST mock successful API call render tests //
  describe("'ProductsManageHolder' after a successful API call", () => {
    let wrapper: ReactWrapper; 

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: products
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );

      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'ProductsManageHolder' 'Grid' after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(ProductsManageHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
    it("Should render correct number of ProductCard components", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    });

  });
  // END mock successfull API call render tests //
  // TEST mock ERROR API call render tests //
  describe("'ProductsManageHolder' component after a Error in API call", () => {
    let wrapper: ReactWrapper; 
    const error = new Error("Error occured");

    beforeAll(async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 500,
        response: {
          responseMsg: "Error here",
          error: error
        }
      });
      
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should correctly render the 'LoadingScreen' component after an API call", () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });

    it("Should ONLY render the 'ErrorScreen' component afert API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);      
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
    it("Should have a retry Product API call Button", () => {
      const retryButton = wrapper.find(ProductsManageHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should correctly re-dispatch the 'getProducts' API request with the button click", async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: products
        }
      });
      const retryButton = wrapper.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");

      await act( async () => promise);
      expect(wrapper.find(ProductsManageHolder).find(ErrorScreen).length).toEqual(0);
    });
    it("Should render ONLY 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    })
    it("Should correctly rerender 'ProductsManageHolder' component", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it("Should render a correct number of 'ProductCard' components", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
  });
  // END mock successfull API call tests //
  describe("'ProductCard' component EDIT button click action", () => {
    let wrapper: ReactWrapper;
    window.scrollTo = jest.fn;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All ok",
          products: products
        }
      });

      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
      wrapper.update();
    });

    it("Should render the 'ProductFormHolder' component after 'edit Button click action", () => {
      const editButton = wrapper.find(ProductCard).at(0).find(".productCardEditBtn").at(0);
      editButton.simulate("click");
      const productFormHolder = wrapper.find(ProductFormHolder);
      expect(productFormHolder.length).toEqual(1);
    });
    it("Should display the '#productFormHolderDetails' component", () => {
      const detailsHolder = wrapper.find(ProductFormHolder).render().find("#productFormHolderDetails");
      expect(detailsHolder.length).toEqual(1);
    });
    it("Should display the correct data in '.productFormHolderDetailsItem' <div>(s)", () => {
      const detailsDivs = wrapper.find(ProductFormHolder).find(".productFormHolderDetailsItem");
      expect(detailsDivs.length).toEqual(4);
      expect(detailsDivs.at(0).render().find("p").html()).toEqual(products[0].name);
      expect(detailsDivs.at(1).render().find("p").html()).toEqual(products[0].price);
      expect(detailsDivs.at(2).render().find("p").html()).toEqual(products[0].description);
      expect(detailsDivs.at(3).render().find("p").html()).toEqual(products[0].details);
    });
    it("Should correctly render the 'ProductForm' component", () => {
      const productFormToggleBtnn = wrapper.find(ProductFormHolder).find("#productFormToggleBtn");
      // toggle form //
      productFormToggleBtnn.at(0).simulate("click");
      // assert correct rendering //
      const productForm = wrapper.find(ProductForm);
      expect(productForm.length).toEqual(1);
    });
    it("Should correctly render the 'currentProduct' data within the 'ProductForm' component", () => {
      const currentProduct = products[0];
      const nameInput = wrapper.find(ProductForm).find('#adminProductFormNameInput');
      const priceInput = wrapper.find(ProductForm).find("#adminProductFormPriceInput");
      const descriptionInput = wrapper.find(ProductForm).find("#adminProductFormDescInput");
      const detailsInput = wrapper.find(ProductForm).find("#adminProductFormDetailsInput");
      // assert correct rendering //
      expect(nameInput.props().value).toEqual(currentProduct.name);
      expect(priceInput.props().value).toEqual(currentProduct.price);
      expect(descriptionInput.at(0).props().value).toEqual(currentProduct.description);
      expect(detailsInput.at(0).props().value).toEqual(currentProduct.details);
    });
    it(`Should route to a correct client route: ${AdminProductRoutes.EDIT_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.EDIT_ROUTE);
    });
    it("Should correctly handle the '#adminProductManageBackBtn' click, close 'ProductFormHHolder' component", () => {
      const backBtn = wrapper.find(ProductsManageHolder).find("#adminProductsManageBackBtn");
      backBtn.at(0).simulate("click");
      expect(wrapper.find(ProductFormHolder).length).toEqual(0);
    });
    it(`Should route to a correct client route: ${AdminProductRoutes.MANAGE_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
  });
  // TEST ProductCard DELETE button click //
  describe("'ProductCard' component DELETE button click action", () => {
    let wrapper:  ReactWrapper;
    let mockDeletedProductItem: IProductData;
    window.scrollTo = jest.fn();

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All ok",
          products: products
        }
      });
      mockDeletedProductItem = products[0];
      // mount and update //
      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminProductRoutes. MANAGE_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
      wrapper.update();
    });
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should render 'Confirm' component after 'DELETE' Button click action", () => {
      const deleteBtn = wrapper.find(ProductCard).at(0).find(".productCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ProductCard).at(0).find(Confirm);
      // assert correct rendering //
      expect(confirmModal.props().open).toEqual(true);
      expect(confirmModal.find(Button).length).toEqual(2);
    });
    it("Should correctly handle {cancelProductDeleteAction} method and update the local component state", () => {
      const deleteBtn = wrapper.find(ProductCard).at(0).find(".productCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ProductCard).at(0).find(Confirm);
      // simlate cancel button click //
      confirmModal.find(Button).at(0).simulate("click");
      // assert correct rendering //
      expect(wrapper.find(ProductCard).at(0).find(Confirm).props().open).toEqual(false);
      expect(wrapper.find(ProductCard).length).toEqual(products.length);
    });
    it("Should correctly handle {confirmProductDeleteAction} method and correctly update local component state", async () => {
      const promise = Promise.resolve();
      moxios.stubRequest(`/api/products/delete/${products[0]._id}`, {
        status: 200,
        response: {
          responseMsg: "All ok",
          deletedProduct: mockDeletedProductItem
        }
      });
      // simulate action //
      const deleteBtn = wrapper.find(ProductCard).at(0).find(".productCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ProductCard).at(0).find(Confirm);
      // simulate confirm action click //
      confirmModal.find(Button).at(1).simulate("click");
      // assert correct rendering //
      await act( async () => promise);
      expect(moxios.requests.mostRecent().url).toEqual(`/api/products/delete/${products[0]._id}`);
    });
    it("Should correctly updated and rerender 'ProductsManage' component", () => {
      wrapper.update();
      expect(wrapper.find(ProductsManageHolder).find(LoadingScreen).length).toEqual(0);
      expect(wrapper.find(ProductsManageHolder).find(ErrorScreen).length).toEqual(0);
      expect(wrapper.find(ProductsManageHolder).find(Grid).length).toEqual(1);    
    });
    it("Should NOT render the 'removed' 'ProductCard' component", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      productCards.forEach((productCard) => {
        expect(productCard.props().product._id).not.toEqual(mockDeletedProductItem._id);
      });
    });
    it("Should rerender with correct number of 'ProductCard' components", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length - 1);
    });

  })

});