import React, { useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import EditControls from "./EditControls"
// css imports //
import "./css/bonusVideoCard.css";
// actions and state /
import { deleteBonusVideo } from "../actions/APIBonusVideoActions";
import { setCurrentBonusVideo, clearCurrentBonusVideo } from "../actions/UIBonusVideoActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps } from "react-router-dom";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props extends RouteComponentProps {
  bonusVideo: IBonusVideoData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const BonusVideoCard: React.FC<Props> = ({ bonusVideo, imageCount, state, dispatch, history }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = "/admin/home/my_bonus_videos/manage"
  const { description,youTubeURL, vimeoURL, createdAt, editedAt } = bonusVideo;

  const handleBonusVideoOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleBonusVideoEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      setCurrentBonusVideo(_id, dispatch, state);
      history.push(baseUrl + "/edit");
      setEditing(true);
    } else {
      clearCurrentBonusVideo(dispatch);
      history.push(baseUrl);
      setEditing(false);
    }
  }
  const handleBonusVideoDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteBonusVideo( _id, dispatch, state)
      .then((success) => {
        
      })
  }

  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
        <div className="bonusVideoManageDesc">
          <h3>Name: {name}</h3>
          <p><strong>Description:</strong> {description}</p>
          <span>Number of Images: <strong>{imageCount}</strong></span>
          <p><span>Created At: </span>{ConvertDate.international(createdAt)}</p>
        </div> 
        <div className="bonusVideoManageCtrls">
          <Button 
            inverted
            color="green"
            className="bonusVideoCardBtn" 
            content="Open" 
            onClick={handleBonusVideoOpen} 
          />
          <Button 
            inverted
            color="orange"
            className="bonusVideoCardBtn" 
            content="Edit" 
            onClick={handleBonusVideoEdit}  
          />
          <Button 
            inverted
            color="red"
            className="bonusVideoCardBtn" 
            content="Delete" 
            onClick={handleBonusVideoDelete}
          />
        </div> 
      </Grid.Row>
      {  editing ?  <EditControls handleBonusVideoEdit={handleBonusVideoEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(BonusVideoCard);