import React from "react";
import { Button, Item } from "semantic-ui-react";
// css //
import "./css/productPreview.css";
// helpers //
import { ConvertDate, setDefaultImage, trimString } from "../../../helpers/displayHelpers";

interface Props {
  product: IProductData;
}

const ProductPreview: React.FC<Props> = ({ product }): JSX.Element => {
  const { name, description, price, images, createdAt } = product;

  return (
    <Item className="productPreviewItem">
      <Item.Image size="small" src={setDefaultImage(images)}/>
      <Item.Content>
        <Item.Meta>
          Displayed name: <strong>{name}</strong>
        </Item.Meta>
        <Item.Meta>
          <span className='productPrice'>Displayed Price: <strong>{price}</strong></span>
          <span className='productCreated'>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
        </Item.Meta>
        <Item.Description>{trimString(description, 200)}</Item.Description>
        <Button basic color="green" content="View"></Button>
      </Item.Content>
    </Item>
  );
};

export default ProductPreview;