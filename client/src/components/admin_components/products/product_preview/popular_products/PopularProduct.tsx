import React from "react";
import { Button, Item } from "semantic-ui-react";
// helpers //
import { ConvertDate, setDefaultImage } from "../../../../helpers/displayHelpers";

interface Props {
  popularProduct: IProductData;
}

const PopularProduct: React.FC<Props> = ({ popularProduct }): JSX.Element => {
  const { name, images, price, createdAt } = popularProduct;
  
  return (
    <Item>
      <Item.Image size="tiny" src={setDefaultImage(images)} />
      <Item.Content>
        <Item.Header>{name}</Item.Header>
        <Item.Meta>
          <span>Priced At: <strong>{price}</strong></span>
          <span>-</span>
          <span>Posted: <strong>{ConvertDate.international(createdAt)}</strong></span>
        </Item.Meta>
        <Button basic color="blue" content="More..." />
      </Item.Content>

    </Item>
  );
};

export default PopularProduct;
