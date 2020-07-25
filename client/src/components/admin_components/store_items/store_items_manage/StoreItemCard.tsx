import React, { useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import EditControls from "./EditControls"
// css imports //
import "./css/storeItemCard.css";
// actions and state /
import { deleteStoreItem } from "../actions/APIStoreItemActions";
import { setCurrentStoreItem, clearCurrentStoreItem } from "../actions/UIStoreItemActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps } from "react-router-dom";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props extends RouteComponentProps {
  store_item: IStoreItemData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreItemCard: React.FC<Props> = ({ store_item, imageCount, state, dispatch, history }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = "/admin/home/my_store_items/manage"
  const { _id, name, price, description, details, images, createdAt, editedAt } = store_item;

  const handleStoreItemOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleStoreItemEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      setCurrentStoreItem(_id, dispatch, state);
      history.push(baseUrl + "/edit");
      setEditing(true);
    } else {
      clearCurrentStoreItem(dispatch);
      history.push(baseUrl);
      setEditing(false);
    }
  }
  const handleStoreItemDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteStoreItem( _id, dispatch, state)
      .then((success) => {
        
      })
  }

  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
        <div className="storeItemManageDesc">
          <h3>Name: {name}</h3>
          <p><strong>Description:</strong> {description}</p>
          <span>Number of Images: <strong>{imageCount}</strong></span>
          <p><span>Created At: </span>{ConvertDate.international(createdAt)}</p>
        </div> 
        <div className="storeItemManageCtrls">
          <Button 
            inverted
            color="green"
            className="storeItemCardBtn" 
            content="Open" 
            onClick={handleStoreItemOpen} 
          />
          <Button 
            inverted
            color="orange"
            className="storeItemCardBtn" 
            content="Edit" 
            onClick={handleStoreItemEdit}  
          />
          <Button 
            inverted
            color="red"
            className="storeItemCardBtn" 
            content="Delete" 
            onClick={handleStoreItemDelete}
          />
        </div> 
      </Grid.Row>
      {  editing ?  <EditControls handleStoreItemEdit={handleStoreItemEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(StoreItemCard);