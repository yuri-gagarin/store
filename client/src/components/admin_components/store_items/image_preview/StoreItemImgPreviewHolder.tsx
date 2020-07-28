import React from "react";
// additional components //
import StoreItemImgThumb from "./StoreItemImgThumb";
// css  imports //
import "./css/storeItemImgPreviewHolder.css";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// helpers
import { deleteStoreItemImage } from "../actions/APIStoreItemActions";

// holder for image preview thumbnails //
interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const StoreItemImgPreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.storeItemState.currentStoreItemData;

  const handleDelete = (_id: string) => {
    deleteStoreItemImage(_id, state, dispatch);
  };

  if (images.length > 0) {
    return (
      <div id="storeItemImgPreviewHolder">
        <div className="storeItemImgHolderTitle">Uploaded Images</div>
        {
          images.map((image) => {
            return (
              <StoreItemImgThumb 
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
      <div id="storeItemImgPreviewNone">
        <h3>No images uploaded... you should upload some... </h3>
      </div>
    );
  }
};

export default StoreItemImgPreviewHolder;


