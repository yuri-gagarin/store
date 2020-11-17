import React from "react";
import { Icon, Image } from "semantic-ui-react";
// css  imports //
import "./css/storeImgPreviewThumb.css";


// image preview thumbnail //
interface ImgPreviewProps {
  _id: string;
  url: string;
  handleDelete(_id: string): void;
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

export default StoreImgPreviewThumb;




