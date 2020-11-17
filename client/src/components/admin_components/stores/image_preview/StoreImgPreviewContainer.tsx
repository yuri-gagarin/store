import React from "react";
// css //
import "./css/storeImgPreviewContainer.css"
// additional components //
import StoreImgPreviewThumb from "./StoreImgPreviewThumb";
// api actions //
import { deleteStoreImage } from "../actions/APIstoreActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const StoreImgPreviewContainer: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.storeState.currentStoreData;

  // delete image handler
  const handleDelete = (_id: string) => {
    deleteStoreImage(_id, state, dispatch);
  };

  return (
    images.length > 0 ?
    <div id="storeImgPreviewContainer">
        <div className="storeImgContainerTitle">Uploaded Images</div>
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

export default StoreImgPreviewContainer;