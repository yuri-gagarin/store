import React from "react";
import { Icon, Image } from "semantic-ui-react";
// css  imports //
import "./css/storeImgPreviewHolder.css";

export const StoreImgPreviewThumb: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className="storeImgPreviewThumb">
      <Image size="small" src="/images/home_page/stock_store1.jpeg">

      </Image>
      <Icon name="trash alternate" className="storeImgPreviewThumbDelete"></Icon>
    </div>
  );
};

const StoreImgPreviewHolder: React.FC<{}> = (props): JSX.Element => {
  return (
    <div id="storeImgPreviewHolder">
      <StoreImgPreviewThumb />
      <StoreImgPreviewThumb />
      <StoreImgPreviewThumb />
      <StoreImgPreviewThumb />
    </div>
  );
};

export default StoreImgPreviewHolder;


