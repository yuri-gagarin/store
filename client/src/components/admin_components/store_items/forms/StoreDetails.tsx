import React from "react";
import { Item } from "semantic-ui-react";
// helpers //
import { setDefaultImage } from "../../../helpers/displayHelpers";
interface Props {
  storeId: string;
  storeName: string;
  storeImageURL?: string;
  createdAt?: string;
}
const StoreDetails: React.FC<Props> = ({ storeId, storeName, storeImageURL, createdAt }): JSX.Element => {
  return (
    <div>
      <Item>
        <Item.Image size="small" src={setDefaultImage(storeImageURL)} />
        <Item.Content>
          <Item.Header>{storeName}</Item.Header>
          <Item.Meta>
          <span className='storeItemFormStoreId'>{storeId}</span>
          <span className='storeItemFormStoreCreated'>{createdAt}</span>
        </Item.Meta>
        </Item.Content>

      </Item>
    </div>
  );
};

export default StoreDetails