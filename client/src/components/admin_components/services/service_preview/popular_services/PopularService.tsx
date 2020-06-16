import React from "react";
import { Button, Item } from "semantic-ui-react";
// helpers //
import { ConvertDate, setDefaultImage } from "../../../../helpers/displayHelpers";

type Props = {
  popularService: IServiceData;
}

const PopularService: React.FC<Props> = ({ popularService }): JSX.Element => {
  const { name, images, price, createdAt } = popularService;
  
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

export default PopularService;
