import React, { useContext } from "react";
import { Icon, Image } from "semantic-ui-react";
// css  imports //
import "./css/storeImgPreviewHolder.css";
import { deleteStoreImage } from "../actions/APIstoreActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";

// image preview thumbnail //
type ImgPreviewProps = {
  _id: string;
  url: string;
  handleDelete(_id: string):void;
}
export const StoreImgPreviewThumb: React.FC<ImgPreviewProps> = ({ _id, url, handleDelete }): JSX.Element => {
  return (
    <div className="storeImgPreviewThumb">
      <Image size="small" src={url}>

      </Image>
      <Icon 
        name="trash alternate" 
        className="storeImgPreviewThumbDelete" 
        onClick={() => handleDelete(_id)}>
      </Icon>
    </div>
  );
};

// holder for image preview thumbnails //
type ImgHolderProps = {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const StoreImgPreviewHolder: React.FC<ImgHolderProps> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.storeState.currentStoreData;

  const handleDelete = (_id: string) => {
    deleteStoreImage(_id, state, dispatch);
  };

  if (images.length > 0) {
    return (
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
    );
  } else {
    return (
      <div id="storeImgPreviewNone">
        <h3>No images uploaded... you should upload some... </h3>
      </div>
    );
  }
};

export default StoreImgPreviewHolder;


