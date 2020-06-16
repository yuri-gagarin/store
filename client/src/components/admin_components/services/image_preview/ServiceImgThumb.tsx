import React from "react";
import { Icon, Image } from "semantic-ui-react";

// image preview thumbnail //
interface Props {
  _id: string;
  url: string;
  handleDelete(_id: string):void;
}
export const ServiceImgThumb: React.FC<Props> = ({ _id, url, handleDelete }): JSX.Element => {
  return (
    <div className="serviceImgPreviewThumb">
      <Image size="small" src={url}>

      </Image>
      <Icon 
        name="trash alternate" 
        className="serviceImgPreviewThumbDelete" 
        onClick={() => handleDelete(_id)}>
      </Icon>
    </div>
  );
};

export default ServiceImgThumb;