import React from "react";
// css //
import "./css/storeImgPreviewHolder.css"
// additional components //
import StoreImgPreviewThumb from "./StoreImgPreviewThumb";
// api actions //
import { deleteStoreImage } from "../actions/APIstoreActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const StoreImgPreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.storeState.currentStoreData;

  // delete image handler
  const handleDelete = (_id: string) => {
    deleteStoreImage(_id, state, dispatch);
  };

  return (
    images.length > 0 ?
    <div id="storeImgPreviewHolder">
        <div className="storeImgHolderTitle">Uploaded Images</div>
        {
          images.map((image) => {
            return (
              <StoreImgPreviewThumb 
                key={image._id} 
                _id={image._id} 
                url={image.url} 
                handleDelete={handleDelete}
              />
            );
          })
        }
      </div>
    :
    <div id="storeImgPreviewNone">
      <h3>No images uploaded... you should upload some... </h3>
    </div>
  );
};

export default StoreImgPreviewHolder;