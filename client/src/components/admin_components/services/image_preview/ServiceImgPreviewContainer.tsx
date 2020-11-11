import React from "react";
// additional components //
import ServiceImgThumb from "./ServiceImgThumb";
// css  imports //
import "./css/serviceImgPreviewContainer.css";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// helpers
import { deleteServiceImage } from "../actions/APIServiceActions";

// holder for image preview thumbnails //
interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
const ServiceImgPreviewContainer: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { images } = state.serviceState.currentServiceData;

  const handleDelete = (_id: string) => {
    deleteServiceImage(_id, state, dispatch);
  };

  if (images.length > 0) {
    return (
      <div id="serviceImgPreviewContainer">
        <div className="serviceImgContainerTitle">Uploaded Images</div>
        {
          images.map((image) => {
            return (
              <ServiceImgThumb 
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
      <div id="serviceImgPreviewNone">
        <h3>No images uploaded... you should upload some... </h3>
      </div>
    );
  }
};

export default ServiceImgPreviewContainer;


