import React, { useState } from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
// client routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";
// css imports //
import "./css/storeCard.css";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
import { deleteStore, getStore } from "../actions/APIstoreActions";
import { setCurrentStore, clearCurrentStore } from "../actions/uiStoreActions";
// css imports //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { clearCurrentService } from "../../services/actions/UIServiceActions";

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
interface StoreCardState {
  editing: boolean;
  confirmModalOpen: boolean;
}
interface EditControlsProps {
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

const StoreCard: React.FC<StoreCardProps> = ({ _id, title, description, imageCount, createdAt, history, state, dispatch }): JSX.Element => {
  const [ storeCardState, setStoreCardState ] = useState<StoreCardState>({ editing: false, confirmModalOpen: false });
  const baseUrl = "/admin/home/my_stores/manage"
  
  // OPEN Store click handler //
  const handleStoreOpen = (): void => {
    history.push(baseUrl + "/view");
  };
  // EDIT Store click handler //
  const handleStoreEditBtn = (): void => {
    if (storeCardState.editing) {
      clearCurrentStore(dispatch);
      history.push(AdminStoreRoutes.MANAGE_ROUTE);
      setStoreCardState({ ...storeCardState, editing: false });
    } else {
      setCurrentStore(_id, dispatch, state);
      history.push(AdminStoreRoutes.EDIT_ROUTE);
      setStoreCardState({ ...storeCardState, editing: true });
    }
  };
  // DELETE Store click handlers CONFIRM and CANCEL //
  const handleStoreDeleteBtn = (): void => {
    setStoreCardState({ ...storeCardState, confirmModalOpen: true });
  };
  const handleStoreDeleteCancelBtn = (): void => {
    setStoreCardState({ ...storeCardState, confirmModalOpen: false });
  };
  const handleStoreDeleteConfirmBtn = (): Promise<void> => {
    return deleteStore(_id, dispatch, state)
      .then((_) => {
        // handle success //
      })
      .catch((_) => {
        // handle error? //
      });
  };

  return (
    <React.Fragment>
      <Grid.Row style={{ border: "3px solid green", padding: "0.5em", marginTop: "2em" }}>
        <Confirm
          open={storeCardState.confirmModalOpen}
          onCancel={handleStoreDeleteCancelBtn}
          onConfirm={handleStoreDeleteConfirmBtn}
        />
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
            className="storeCardEditBtn" 
            content="Edit" 
            onClick={handleStoreEditBtn}  
          />
          <Button 
            inverted
            color="red"
            className="storeCardDeleteBtn" 
            content="Delete" 
            onClick={handleStoreDeleteBtn}
          />
        </Grid.Column> 
      </Grid.Row>
      {  storeCardState.editing ?  <CancelEditControls handleStoreEdit={handleStoreEditBtn}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(StoreCard);