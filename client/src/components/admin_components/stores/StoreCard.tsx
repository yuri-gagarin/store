import React, { useContext, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { Store } from "../../../state/Store";
import { deleteStore } from "./actions/APIstoreActions";
import StoreFormHolder from "./forms/StoreFormHolder";
import { setCurrentStore } from "./actions/uiStoreActions";
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/storeCard.css";

interface Props extends RouteComponentProps {
  _id: string;
  imgUrl?: string;
  title: string;
  description: string;
  createdAt: string;
  editedAt?: string;
}

const StoreCard: React.FC<Props> = ({  _id, imgUrl, title, description, createdAt, editedAt, history }): JSX.Element => {
  const { dispatch, state } = useContext(Store);
  const [ editing, setEditing ] = useState<boolean>(false);
  /*
  const setStoreImg = (imgUrl: string | undefined): string => {
    return imgUrl ? imgUrl : "/images/logos/go_ed_log.jpg";
  }
  */
  const handleStoreOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {

  }
  const handleStoreEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const baseUrl = "/admin/home/my_store/manage"
    if (!editing) {
      setCurrentStore(_id, dispatch, state);
      history.push(baseUrl + "/edit");
      setEditing(true);
    } else {
      history.push(baseUrl);
      setEditing(false);
    }
  }
  const handleStoreDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteStore( _id, dispatch, state)
      .then((success) => {
        
      })
  }
  return (
    <React.Fragment>
      { !editing ? 
      <Grid.Row style={{ border: "3px solid green", padding: "0.5em", marginTop: "2em" }}>
        <Grid.Column computer={12} mobile={16} style={{ border: '2px solid red'}}>
          <h3>{title}</h3>
          <h5>{description}</h5>
          <p>{createdAt}</p>
        </Grid.Column> 
        <Grid.Column computer={4} mobile={16} style={{ border: '2px solid blue'}}>
          <Button 
            inverted
            color="green"
            className="storeCardBtn" 
            content="Open" 
            onClick={handleStoreOpen} 
          />
          <Button 
            inverted
            color="orange"
            className="storeCardBtn" 
            content="Edit" 
            onClick={handleStoreEdit}  
          />
          <Button 
            inverted
            color="red"
            className="storeCardBtn" 
            content="Delete" 
            onClick={handleStoreDelete}
          />
        </Grid.Column> 
      </Grid.Row>
      : null
      }
      {  editing ? <Button content="Cancel Edit" onClick={handleStoreEdit}></Button> : null }
      {  editing ? <StoreFormHolder /> : null }
    </React.Fragment>
    
  );
};

export default withRouter(StoreCard);