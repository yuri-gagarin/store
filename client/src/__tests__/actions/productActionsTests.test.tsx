import React from "react";
import faker from "faker";
// test dependences //
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
// component dependencies //
import ProductView from "../../components/admin_components/products/ProductsView";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext } from "../../state/Store";
import { StateProvider } from "../../state/Store";
// actions to test //
import { setCurrentProduct, clearCurrentProduct } from "../../components/admin_components/products/actions/UIProductActions";
import { getAllProducts, getProduct, createProduct, editProduct, 
  deleteProduct, uploadProductImage, deleteProductImage 
} from "../../components/admin_components/products/actions/APIProductActions";
// helpers and additional dependencies //
import { emptyProductData } from "../../state/reducers/productReducer";
import { createMockProducts, createMockProductImage } from "../../test_helpers/productHelpers"
import { ClientProductData } from "../../components/admin_components/products/actions/APIProductActions";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("Product Actions Tests", () => {
  let wrapper: ShallowWrapper;
  beforeAll(() => {
    wrapper = shallow(
    <StateProvider>
      <ProductView></ProductView>
    </StateProvider>
    );
  })
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });

  describe("Action: 'SET_CURRENT_PRODUCT'", () => {
    let mockProducts: IProductData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      mockProducts = createMockProducts(10);
     ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", () => {
      state.productState.loadedProducts = [ ...mockProducts ];
      const product = state.productState.loadedProducts[0];
      setCurrentProduct(product._id, dispatch, state);
    });
    it('Should return the correct new state', () => {
      // expected state after action //
      const expectedProductState = state.productState;
      expectedProductState.currentProductData = mockProducts[0];
      // retrieve new state //
      const { state : newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'CLEAR_CURRENT_PRODUCT'", () => {
    let mockProducts: IProductData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      mockProducts = createMockProducts(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.productState.currentProductData = mockProducts[0];
    });
    it("Should properly dispatch the action", () => {
      clearCurrentProduct(dispatch);
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = state.productState;
      expectedProductState.currentProductData = emptyProductData();
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'GET_ALL_PRODUCTS'", () => {
    let mockProducts: IProductData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      mockProducts = createMockProducts(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            products: mockProducts
          }
        });
      });
      getAllProducts(dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.loadedProducts = mockProducts;
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'GET_PRODUCT'", () => {
    let mockProduct: IProductData; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      mockProduct = createMockProducts(1)[0];
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            product: mockProduct
          }
        });
      });
      // mock action with moxios //
      getProduct(mockProduct._id, dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = mockProduct;
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'CREATE_PRODUCT'", () => {
    let createdProduct: IProductData; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      createdProduct = createMockProducts(1)[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            newProduct: createdProduct
          }
        });
      });
      // mock product form data //
      let newProduct: ClientProductData = {
        name: createdProduct.name,
        description: createdProduct.description,
        price: "100",
        productImages: createdProduct.images
      };
      // mock action with moxios //
      createProduct(newProduct, dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = createdProduct;
      expectedProductState.loadedProducts = [ ...expectedProductState.loadedProducts, createdProduct ]
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'EDIT_PRODUCT'", () => {
    let editedProduct: IProductData; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      let product = { ...state.productState.loadedProducts[0] };
      product.name = faker.lorem.word();
      product.description = faker.lorem.paragraphs(1),
      editedProduct = product;
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            editedProduct: editedProduct
          }
        });
      });
      // mock product form data //
      let productUpdate: ClientProductData = {
        name: editedProduct.name,
        price: editedProduct.price,
        description: editedProduct.description,
        productImages: editedProduct.images
      };
      // mock action with moxios //
      editProduct(editedProduct._id, productUpdate, dispatch, state)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = editedProduct;
      expectedProductState.loadedProducts = expectedProductState.loadedProducts.map((product) => {
        if (product._id === editedProduct._id) {
          return editedProduct;
        } else {
          return product;
        }
      })
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'DELETE_PRODUCT'", () => {
    let deletedProduct: IProductData; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      deletedProduct = state.productState.loadedProducts[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            deletedProduct: deletedProduct
          }
        });
      });
      // mock action with moxios //
      deleteProduct(deletedProduct._id, dispatch, state)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = emptyProductData();
      expectedProductState.loadedProducts = state.productState.loadedProducts.filter((product) => product._id !== deletedProduct._id);
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'UPLOAD_PRODUCT_IMAGE'", () => {
    let createdImage: IProductImgData; let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    let updatedProduct: IProductData;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.productState.currentProductData = state.productState.loadedProducts[0];
      createdImage = createMockProductImage();
      // set mock updated product with mock image //
      updatedProduct = state.productState.loadedProducts[0];
      updatedProduct.images.push(createdImage);
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            updatedProduct: updatedProduct
          }
        });
      });
      // mock action with moxios //
      const formData = new FormData();
      uploadProductImage(updatedProduct._id, formData, state, dispatch) 
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = updatedProduct;
      expectedProductState.loadedProducts = state.productState.loadedProducts.map((product) => {
        if (product._id === updatedProduct._id) {
          return updatedProduct;
        } else {
          return product;
        }
      });
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

  describe("Action: 'DELETE_PRODUCT_IMAGE'", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;
    let updatedProduct: IProductData;

    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      updatedProduct = { ...state.productState.currentProductData, images: [] };
    });

    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            updatedProduct: updatedProduct
          }
        });
      });
      // mock action with moxios //
      deleteProductImage(updatedProduct._id, state, dispatch) 
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedProductState = { ...state.productState };
      expectedProductState.responseMsg = "All Ok";
      expectedProductState.currentProductData = updatedProduct;
      expectedProductState.loadedProducts = state.productState.loadedProducts.map((product) => {
        if (product._id === updatedProduct._id) {
          return  {
            ...updatedProduct,
            images: []
          };
        } else {
          return product;
        }
      });
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.productState).to.eql(expectedProductState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.productState.error).to.equal(null);
    });
  });

});