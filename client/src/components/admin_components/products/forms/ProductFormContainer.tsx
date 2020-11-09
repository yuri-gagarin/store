import React, { useState, useEffect, useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
// client routing //
import { RouteComponentProps, withRouter } from "react-router-dom";
// css imports //
import "./css/productFormContainer.css";
// additional components //
import ProductForm from "./ProductForm";
import ProductImgPreviewContainer from "../image_preview/ProductImgPreviewContainer";
import LoadingBar from "../../miscelaneous/LoadingBar";
import ProductImgUplForm from "./ProductImgUplForm";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createProduct, editProduct } from "../actions/APIProductActions";
import { closeProductForm, openProductForm, clearProductAPIError } from "../actions/UIProductActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
// types 
import { ProductData, ProductFormState } from "../type_definitions/productTypes";
import ErrorBar from "../../miscelaneous/ErrorBar";

interface ProductFormContState {
  productFormState: ProductFormState;
  newForm: boolean;
}

interface Props extends RouteComponentProps {
 
}

const ProductFormContainer: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentProductData, productFormOpen, error } = state.productState;
  const { name, description, details, price, createdAt, editedAt } = currentProductData;
  // local component state //
  // const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ productFormContState, setProductFormContState ] = useState<ProductFormContState>({
    newForm: true,
    productFormState: { name: "", price: "", details: "", description: ""}
  });

  // ProductForm toggle //
  const toggleProductForm = () => {
    productFormOpen ? closeProductForm(dispatch) : openProductForm(dispatch);
  };
  // CLEAR Product API ERRROR //
  const clearCurrentError = () => {
    clearProductAPIError(dispatch);
  };
  // API call handlers CREATE - EDIT //
  const handleCreateProduct = (productFormData: ProductFormState): void => {
    const productData: ProductData = {
      ...productFormData,
      images: currentProductData.images
    };
    createProduct(productData, dispatch)
      .then((_) => {
        // product created //
        closeProductForm(dispatch);
      })
      .catch((_) => {
        // handle error or show modal //
        // set form state //
        // console.log("create error occured")
        setProductFormContState({
          ...productFormContState,
          productFormState: { ...productData }
        });
      });
  };
  const handleUpdateProduct = (productFormData: ProductFormState): void => {
    const productParams: ProductData = {
      ...productFormData,
      images: currentProductData.images
    };
    editProduct(currentProductData._id, productParams, dispatch, state)
      .then((_) => {
        closeProductForm(dispatch)
      })
      .catch((_) => {
        // handle error show modal //
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    if (!productFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ productFormOpen ]);
  useEffect(() => {
    if (checkSetValues(currentProductData)) {
      const { name, price, description, details } = currentProductData;
      setProductFormContState({
        newForm: false,
        productFormState: {
          name,
          price,
          description,
          details
        }
      });
    }
  }, [ currentProductData ]);
  
  // component return //
  return (
    <div id="productFormContainer">
      { loading ? <LoadingBar /> : null }
      {
        !productFormContState.newForm ?
          <div id={"productFormContainerDetails"}>
            <Grid.Row> 
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="productFormContainerDetailsItem">
                  <h3>Product name:</h3>
                  <p>{name}</p>
                </div>
                <div className="productFormContainerDetailsItem">
                  <h3>Product price:</h3>
                  <p>{price}</p>
                </div>
                <div className="productFormContainerDetailsItem">
                  <h3>Product description:</h3>
                  <p>{description}</p>
                </div>
                <div className="productFormContainerDetailsItem">
                  <h3>Product details:</h3>
                  <p>{details}</p>
                </div>
                <div className="productFormContainerTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <ProductImgPreviewContainer state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <ProductImgUplForm />
          </div>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  
            id="productFormToggleBtn"
            onClick={toggleProductForm} 
            content={ !productFormOpen ? "Open Form" : "Close Form"}
          />
          { error ? <ErrorBar clearError={clearCurrentError} error={error} /> : null }
          {
            productFormOpen ? 
              <ProductForm 
                newForm={productFormContState.newForm}
                handleCreateProduct={handleCreateProduct}
                handleUpdateProduct={handleUpdateProduct}
                { ...productFormContState.productFormState }
              /> 
            : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
};
// export without router for tests //
export { ProductFormContainer };
// default export //
export default withRouter(ProductFormContainer);

