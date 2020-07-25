import React from "react";
import { Button, Item } from "semantic-ui-react";
// css //
import "./css/storeItemPreview.css";
// helpers //
import { ConvertDate, setDefaultImage, trimString } from "../../../helpers/displayHelpers";

interface Props {
  storeItem: IStoreItemData;
}

const StoreItemPreview: React.FC<Props> = ({ storeItem }): JSX.Element => {
  const { name, description, price, images, categories, createdAt } = storeItem;

  return (
    <Item className="storeItemPreviewItem">
      <Item.Image size="small" src={setDefaultImage(images)}/>
      <Item.Content>
        <Item.Meta>
          Displayed name: <strong>{name}</strong>
        </Item.Meta>
        <Item.Meta>
          Store name: <strong>Store Name Here</strong>
        </Item.Meta>
        <Item.Meta>
          {categories}
        </Item.Meta>
        <Item.Meta>
          <span className='storeItemPrice'>Displayed Price: <strong>{price}</strong></span>
          <span className='storeItemCreated'>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
        </Item.Meta>
        <Item.Description>{trimString(description, 200)}</Item.Description>
        <Button basic color="green" content="View"></Button>
      </Item.Content>
    </Item>
  );
};

export default StoreItemPreview;