import React, { useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import EditControls from "./EditControls"
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

interface Props extends RouteComponentProps {
  service: IServiceData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const ServiceCard: React.FC<Props> = ({ service, imageCount, state, dispatch, history }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = "/admin/home/my_services/manage"
  const { _id, name, price, description, images, createdAt, editedAt } = service;

  const handleServiceOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleServiceEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      setCurrentService(_id, dispatch, state);
      history.push(baseUrl + "/edit");
      setEditing(true);
    } else {
      clearCurrentService(dispatch);
      history.push(baseUrl);
      setEditing(false);
    }
  }
  const handleServiceDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteService( _id, dispatch, state)
      .then((success) => {
        
      })
  }

  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
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
            className="serviceCardBtn" 
            content="Edit" 
            onClick={handleServiceEdit}  
          />
          <Button 
            inverted
            color="red"
            className="serviceCardBtn" 
            content="Delete" 
            onClick={handleServiceDelete}
          />
        </div> 
      </Grid.Row>
      {  editing ?  <EditControls handleServiceEdit={handleServiceEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(ServiceCard);