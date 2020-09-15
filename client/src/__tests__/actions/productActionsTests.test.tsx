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
import { createMockProducts, createMockProductImage, clearProductState } from "../../test_helpers/productHelpers"
import { ClientProductData } from "../../components/admin_components/products/type_definitions/productTypes";
import { AxiosRequestConfig } from "axios";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("Product Actions Tests", () => {
  let wrapper: ShallowWrapper; let error = new Error("An error");

  beforeAll(() => {
    wrapper = shallow(
      <StateProvider />
    );
  });

  describe("Mock requests witn no API error", () => {

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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockProducts = createMockProducts(10);
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              products: mockProducts
            }
          });
        });
        // mock action with moxios //
        getAllProducts(dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/products");
        expect(requestConfig.method).to.eq("get");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockProduct = createMockProducts(1)[0];
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/products/" + mockProduct._id);
        expect(requestConfig.method).to.eq("get");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        createdProduct = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          images: createdProduct.images
        };
        // mock action with moxios //
        createProduct(newProduct, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/products/create");
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct Service Data", () => {
        const sentData: ClientProductData = JSON.parse(requestConfig.data);
        const { name, price, description, images } = sentData;
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        editedProduct = { ...state.productState.loadedProducts[0] };
        editedProduct.name = faker.lorem.word();
        editedProduct.description = faker.lorem.paragraphs(1);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          images: editedProduct.images
        };
        // mock action with moxios //
        editProduct(editedProduct._id, productUpdate, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/products/update/" + editedProduct._id);
        expect(requestConfig.method).to.eq("patch");
      });
      it("Should send the correct Service Data", () => {
        const sentData: ClientProductData = JSON.parse(requestConfig.data);
        const { name, price, description, images } = sentData;
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedProduct = { ...state.productState.loadedProducts[0] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/products/delete/" + deletedProduct._id);
        expect(requestConfig.method).to.eq("delete");
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
      let updatedProduct: IProductData; let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.productState.currentProductData = state.productState.loadedProducts[0];
        createdImage = createMockProductImage();
        // set mock updated product with mock image //
        updatedProduct = { ...state.productState.loadedProducts[0] };
        updatedProduct.images.push(createdImage);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/product_images/" + updatedProduct._id);
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct request Data", () => {
        expect(requestConfig.data instanceof FormData).to.eq(true);
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
      let updatedProduct: IProductData; let deletedImage: IProductImgData;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedImage = { ...state.productState.currentProductData.images[0] };
        updatedProduct = { ...state.productState.currentProductData, images: [] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedProduct: updatedProduct
            }
          });
        });
        // mock action with moxios //
        deleteProductImage(deletedImage._id, state, dispatch) 
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/product_images/" + deletedImage._id + "/" + updatedProduct._id);
        expect(requestConfig.method).to.eq("delete");
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

  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<ProductAction>;

    beforeEach(() => {
      moxios.install();
      clearProductState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_PRODUCTS'", () => {
      // const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error);
        });
        getAllProducts(dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_PRODUCT'", () => {
      let product: IProductData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        product = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getProduct(product._id, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_PRODUCT'", () => {
      let product: IProductData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        product = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        createProduct(product, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_PRODUCT'", () => {
      let product: IProductData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        product = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        editProduct(product._id, product, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_PRODUCT'", () => {
      let product: IProductData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        product = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteProduct(product._id, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_PRODUCT_IMAGE'", () => {
      let product: IProductData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        product = createMockProducts(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        const mockImg = new FormData();
        uploadProductImage(product._id, mockImg, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_PRODUCT_IMAGE'", () => {
      let productImage: IProductImgData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        productImage = createMockProductImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteProductImage(productImage._id, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedProductState = { ...state.productState };
        expectedProductState.responseMsg = error.message;
        expectedProductState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.productState).to.eql(expectedProductState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.productState.error).to.not.be.null;
      });
    });

  });
});