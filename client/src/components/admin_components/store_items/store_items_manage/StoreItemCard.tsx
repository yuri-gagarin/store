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
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";

interface Props extends RouteComponentProps {
  storeItem: IStoreItemData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreItemCard: React.FC<Props> = ({ storeItem, imageCount, state, dispatch, history }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = AdminStoreItemRoutes.MANAGE_ROUTE
  const { _id, name, price, description, details, images, createdAt, editedAt } = storeItem;

  const handleStoreItemOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleStoreItemEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      setCurrentStoreItem(_id, dispatch, state);
      history.push(AdminStoreItemRoutes.EDIT_ROUTE);
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
            className="storeItemCardOpenBtn"
            inverted
            color="green"
            content="Open" 
            onClick={handleStoreItemOpen} 
          />
          <Button 
            className="storeItemCardEditBtn"
            inverted
            color="orange"
            content="Edit" 
            onClick={handleStoreItemEdit}  
          />
          <Button 
            className="storeItemCardDeleteBtn"
            inverted
            color="red"
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