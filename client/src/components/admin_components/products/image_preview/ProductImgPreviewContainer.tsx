import React from "react";
// additional components //
import ProductImgThumb from "./ProductImgThumb";
// css  imports //
import "./css/productImgPreviewHolder.css";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// helpers
import { deleteProductImage } from "../actions/APIProductActions";

// holder for image preview thumbnails //
interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const ProductImgPreviewContainer: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.productState.currentProductData;

  const handleDelete = (_id: string) => {
    deleteProductImage(_id, state, dispatch);
  };

  if (images.length > 0) {
    return (
      <div id="productImgPreviewHolder">
        <div className="productImgHolderTitle">Uploaded Images</div>
        {
          images.map((image) => {
            return (
              <ProductImgThumb 
                key={image._id} 
                _id={image._id} 
                url={image.url} 
                handleDelete={handleDelete}
              />
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div id="productImgPreviewNone">
        <h3>No images uploaded... you should upload some... </h3>
      </div>
    );
  }
};

export default ProductImgPreviewContainer;


