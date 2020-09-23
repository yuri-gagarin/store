import React, { useState, useEffect, useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
// client routing //
import { RouteComponentProps, withRouter } from "react-router-dom";
// css imports //
import "./css/productFormHolder.css";
// additional components //
import ProductForm from "./ProductForm";
import ProductImgPreviewHolder from "../image_preview/ProductImgPreviewHolder";
import LoadingBar from "../../miscelaneous/LoadingBar";
import ProductImgUplForm from "./ProductImgUplForm";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createProduct, editProduct } from "../actions/APIProductActions";
import { closeProductForm, openProductForm } from "../actions/UIProductActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
// types 
import { FormState } from "./ProductForm";


interface Props extends RouteComponentProps {
 
}

type ProductData = {
  name: string;
  description: string;
  price: string;
  images: IProductImgData[];
}

const ProductFormHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state,dispatch } = useContext(Store);
  const { loading, currentProductData, productFormOpen, error } = state.productState;
  const { name, description, price, createdAt, editedAt } = currentProductData;
  // local component state //
  // const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  // ProductForm toggle //
  const toggleProductForm = () => {
    productFormOpen ? closeProductForm(dispatch) : openProductForm(dispatch);
  };
  // API call handlers CREATE - EDIT //
  const handleCreateProduct = ({ name, price, description }: FormState): void => {
    const productData: ProductData = {
      name,
      description,
      price,
      images: currentProductData.images
    };
    createProduct(productData, dispatch)
      .then((_) => {
        // product created //
        closeProductForm(dispatch);
      })
      .catch((_) => {
        // handle error or show modal //
      });
  };
  const handleUpdateProduct = ({ name, description, price }: FormState): void => {
    const productParams: ProductData = {
      name, description, price, images: currentProductData.images
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
    checkSetValues(currentProductData) ? setNewForm(false) : setNewForm(true);
  }, [ currentProductData ]);
  // component return //
  return (
    <div id="productFormHolder">
      { loading ? <LoadingBar /> : null }
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row id={"productFormHolderDetails"}> 
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="productFormHolderDetailsItem">
                  <h3>Product name:</h3>
                  <p>{name}</p>
                </div>
                <div className="productFormHolderDetailsItem">
                  <h3>Product price:</h3>
                  <p>{price}</p>
                </div>
                <div className="productFormHolderDetailsItem">
                  <h3>Product description:</h3>
                  <p>{description}</p>
                </div>
                <div className="productFormHolderTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <ProductImgPreviewHolder state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <ProductImgUplForm />
          </React.Fragment>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  
            id="productFormToggleBtn"
            onClick={toggleProductForm} 
            content={ !productFormOpen ? "Open Form" : "Close Form"}
          />
          {
            productFormOpen ? 
              <ProductForm 
                name={name} 
                description={description} 
                price={price}
                handleCreateProduct={handleCreateProduct}
                handleUpdateProduct={handleUpdateProduct}
              /> 
            : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
};
// export without router for tests //
export { ProductFormHolder };
// default export //
export default withRouter(ProductFormHolder);

