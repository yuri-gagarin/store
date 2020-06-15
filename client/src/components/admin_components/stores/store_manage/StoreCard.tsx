import React, { useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
import { deleteStore, getStore } from "../actions/APIstoreActions";
import { setCurrentStore, clearCurrentStore } from "../actions/uiStoreActions";
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/storeCard.css";
import { ConvertDate } from "../../../helpers/displayHelpers";

interface StoreCardProps extends RouteComponentProps {
  _id: string;
  imgUrl?: string;
  title: string;
  description: string;
  imageCount: number;
  createdAt: string;
  editedAt?: string;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
type EditControlsProps = {
  handleStoreEdit(e:  React.MouseEvent<HTMLButtonElement>): void;
}

const CancelEditControls: React.FC<EditControlsProps> = ({ handleStoreEdit }): JSX.Element => {
  return (
    <Grid.Row>
      <Grid.Column>
         <Button content="Close Edit" onClick={handleStoreEdit}></Button>
      </Grid.Column>
    </Grid.Row>
  )
}

const StoreCard: React.FC<StoreCardProps> = ({ 
   _id, title, description, imageCount, createdAt, editedAt, history,
   state, dispatch
  }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = "/admin/home/my_store/manage"
 
  const handleStoreOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleStoreEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      //setCurrentStore(_id, dispatch, state);
      //history.push(baseUrl + "/edit");
      //setEditing(true);

      
      getStore(_id, dispatch)
        .then((success) => {
          if (success) {
            history.push(baseUrl + "/edit");
            setEditing(true);
          }
        
        });
      
     
    } else {
      clearCurrentStore(dispatch);
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
      <Grid.Row style={{ border: "3px solid green", padding: "0.5em", marginTop: "2em" }}>
        <Grid.Column computer={12} mobile={16} style={{ border: '2px solid red'}}>
          <h3>Title: {title}</h3>
          <h5>Description: {description}</h5>
          <h5>Number of Images: {imageCount}</h5>
          <p><span>Created At: </span>{ConvertDate.international(createdAt)}</p>
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
      {  editing ?  <CancelEditControls handleStoreEdit={handleStoreEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(StoreCard);