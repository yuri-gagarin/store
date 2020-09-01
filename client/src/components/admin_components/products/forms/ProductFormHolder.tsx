import React, { useState, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
// css imports //
import "./css/productFormHolder.css";
// additional components //
import ProductForm from "./ProductForm";
import ProductImgPreviewHolder from "../image_preview/ProductImgPreviewHolder";
import ProductImgUplForm from "./ProductImgUplForm";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// api actions //
import { createProduct, editProduct } from "../actions/APIProductActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
// types 
import { FormState } from "./ProductForm";
interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

type ProductData = {
  name: string;
  description: string;
  price: string;
  images: IProductImgData[];
}

const ProductFormHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ imgUpload, setImgUpload ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  const { currentProductData } = state.productState;
  const { name, description, price, createdAt, editedAt } = currentProductData;

  const handleCreateProduct = ({ name, price, description }: FormState): void => {
    const productData: ProductData = {
      name,
      description,
      price,
      images: currentProductData.images
    };

    createProduct(productData, dispatch)
      .then((success) => {
        if (success) {
          // product created //
          setImgUpload(true);
        } else {
          console.error("error");
        }
      });
  };

  const handleUpdateProduct = ({ name, description, price }: FormState): void => {
    const productParams: ProductData = {
      name, description, price, images: currentProductData.images
    };

    editProduct(currentProductData._id, productParams, dispatch, state)
      .then((success) => {
        if (success) {
          setFormOpen(false);
        }
      })
  }

  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };
  
  useEffect(() => {
    if (!formOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formOpen])
  useEffect(() => {
    if (name && description && price) {
      setNewForm(false);
      setFormOpen(true);
    }
  }, [name, description, price]);


  return (
    <div id="productFormHolder">
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="productFormHolderDetails">
                  <h3>Product name:</h3>
                  <p>{name}</p>
                </div>
                <div className="productFormHolderPrice">
                  <h3>Product price:</h3>
                  <p>{price}</p>
                </div>
                <div className="productFormHolderDetails">
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
          <Button  id="productFormToggleBtn" onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
          {
            formOpen ? <ProductForm 
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

export default ProductFormHolder;

