import React, { useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
import { Store } from "../../../state/Store";
import { deleteStore } from "./api_handlers/storeActions";

type Props = {
  _id: string;
  imgUrl?: string;
  title: string;
  description: string;
  createdAt: string;
  editedAt?: string;
}

const StoreCard: React.FC<Props> = ({  _id, imgUrl, title, description, createdAt, editedAt }): JSX.Element => {
  const { dispatch, state } = useContext(Store);
  const setStoreImg = (imgUrl: string | undefined): string => {
    return imgUrl ? imgUrl : "/images/logos/go_ed_log.jpg";
  }

  const handleStoreOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {

  }
  const handleStoreEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    
  }
  const handleStoreDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteStore( _id, dispatch, state)
      .then((success) => {
        
      })
  }
  return (
    <React.Fragment>
      <Grid.Row>
        <Grid.Column computer={12} mobile={16} style={{ border: '2px solid red'}}>
          <h3>{title}</h3>
          <h5>{description}</h5>
          <p>{createdAt}</p>
        </Grid.Column> 
        <Grid.Column computer={4} mobile={16} style={{ border: '2px solid blue'}}>
          <Button content="Open" onClick={handleStoreOpen}></Button>
          <Button content="Edit" onClick={handleStoreEdit}></Button>
          <Button content="Delete" onClick={handleStoreDelete}></Button>


        </Grid.Column> 
      </Grid.Row>
    </React.Fragment>
    
  );
};

export default StoreCard;