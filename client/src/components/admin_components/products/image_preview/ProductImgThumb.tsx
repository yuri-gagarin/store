import React from "react";
import { Icon, Image } from "semantic-ui-react";

// image preview thumbnail //
interface Props {
  _id: string;
  url: string;
  handleDelete(_id: string):void;
}
export const ProductImgThumb: React.FC<Props> = ({ _id, url, handleDelete }): JSX.Element => {
  return (
    <div className="productImgPreviewThumb">
      <Image size="small" src={url}>

      </Image>
      <Icon 
        name="trash alternate" 
        className="productImgPreviewThumbDelete" 
        onClick={() => handleDelete(_id)}>
      </Icon>
    </div>
  );
};

export default ProductImgThumb;