import React, { useState } from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
// additional components //
import EditControls from "./EditControls"
import LoadingBar from "../../miscelaneous/LoadingBar";
// css imports //
import "./css/serviceCard.css";
// actions and state /
import { deleteService } from "../actions/APIServiceActions";
import { setCurrentService, clearCurrentService} from "../actions/UIServiceActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps } from "react-router-dom";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { AdminServiceRoutes } from "../../../../routes/adminRoutes";

interface Props extends RouteComponentProps {
  service: IServiceData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
interface ServiceCardState {
  editing: boolean;
  confirmDeleteOpen: boolean;
}
const ServiceCard: React.FC<Props> = ({ service, imageCount, state, dispatch, history }): JSX.Element => {
  const [ serviceCardState, setServiceCardState ] = useState<ServiceCardState>({ editing: false, confirmDeleteOpen: false });
  const baseUrl = "/admin/home/my_services/manage"
  const { _id, name, price, description, images, createdAt, editedAt } = service;
  const { loading } = state.serviceState;

  const handleServiceOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  };
  // EDIT controls //
  const handleEditBtnClick = ()  => {
    if(serviceCardState.editing) {
      clearCurrentService(dispatch);
      history.goBack();
    } else {
      setCurrentService(_id, dispatch, state);
      history.push(AdminServiceRoutes.EDIT_ROUTE);
    }
  };
  // DELETE controls //
  const handleDeleteBtnClick = (): void => {
    setServiceCardState({
      ...serviceCardState,
      confirmDeleteOpen: true
    });
  };
  const handleServiceDelete = () => {
    return deleteService(_id, dispatch, state)
      .then((_) => {
        // delete succussful do something ? //
      })
      .catch((_) => {
        // handle an error ? //
      });
  };
  const handleServiceDeleteCancel = () => {
    setServiceCardState({
      ...serviceCardState,
      confirmDeleteOpen: false
    });
  };
  
  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
        {
          loading ? <LoadingBar /> : null
        }
        <Confirm
          open={serviceCardState.confirmDeleteOpen}
          onCancel={handleServiceDeleteCancel}
          onConfirm={handleServiceDelete}
        />
        <div className="serviceManageDesc">
          <h3>Name: {name}</h3>
          <p><strong>Description:</strong> {description}</p>
          <span>Number of Images: <strong>{imageCount}</strong></span>
          <p><span>Created At: </span>{ConvertDate.international(createdAt)}</p>
        </div> 
        <div className="serviceManageCtrls">
          <Button 
            inverted
            color="green"
            className="serviceCardBtn" 
            content="Open" 
            onClick={handleServiceOpen} 
          />
          <Button 
            inverted
            color="orange"
            className="serviceCardEditBtn" 
            content="Edit" 
            onClick={handleEditBtnClick}  
          />
          <Button 
            inverted
            color="red"
            className="serviceCardDeleteBtn" 
            content="Delete" 
            onClick={handleDeleteBtnClick}
          />
        </div> 
      </Grid.Row>
      {  serviceCardState.editing ?  <EditControls handleServiceEdit={handleEditBtnClick}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(ServiceCard);