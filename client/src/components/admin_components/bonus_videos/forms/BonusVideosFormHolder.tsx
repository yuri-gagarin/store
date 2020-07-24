import React, { useState, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
// css imports //
import "./css/bonusVideoFormHolder.css";
// additional components //
import BonusVideoForm from "./BonusVideoForm";
import BonusVideoPreview from "../bonus_videos_preview/BonusVideoPreview";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// api actions //
import { createBonusVideo, editBonusVideo } from "../actions/APIBonusVideoActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
// types 
import { FormState } from "./BonusVideoForm";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<BonusVideoAction>;
}

type BonusVideoData = {
  description: string;
  youTubeURL: string;
  vimeoURL: string;
}

const BonusVideoFormHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  const { currentBonusVideoData } = state.bonusVideoState;
  const { description, youTubeURL, vimeoURL, createdAt, editedAt } = currentBonusVideoData;

  const handleCreateBonusVideo = ({ description, youTubeURL, vimeoURL }: FormState): void => {
    const bonusVideoData: BonusVideoData = {
      description,
      youTubeURL,
      vimeoURL
    };

    createBonusVideo(bonusVideoData, dispatch)
      .then((success) => {
       
      });
  };

  const handleUpdateBonusVideo = ({ description, youTubeURL, vimeoURL }: FormState): void => {
    const bonusVideoParams: BonusVideoData = {
      description,
      youTubeURL,
      vimeoURL
    };

    editBonusVideo(currentBonusVideoData._id, bonusVideoParams, dispatch, state)
      .then((success) => {
        if (success) {
          setFormOpen(false);
        }
      })
  }

  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };
  
  useEffect(() => {
    if (!formOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formOpen])
  useEffect(() => {
    if (description || vimeoURL || youTubeURL) {
      setNewForm(false);
    }
  }, [description, vimeoURL, youTubeURL]);


  return (
    <div id="bonusVideoFormHolder">
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="bonusVideoFormHolderDetails">
                  <h3>Video youTube URL:</h3>
                  <p>{youTubeURL}</p>
                </div>
                <div className="bonusVideoFormHolderPrice">
                  <h3>Video vimeo URL:</h3>
                  <p>{vimeoURL}</p>
                </div>
                <div className="bonusVideoFormHolderDetails">
                  <h3>Video description:</h3>
                  <p>{description}</p>
                </div>
                <div className="bonusVideoFormHolderTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
                <div className="bonusVideoFormPreview">
                  <BonusVideoPreview bonusVideo={currentBonusVideoData} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  id="bonusVideoFormToggleBtn" onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
          {
            formOpen ? <BonusVideoForm 
                        description={description} 
                        youTubeURL={youTubeURL}
                        vimeoURL={vimeoURL}
                        handleCreateBonusVideo={handleCreateBonusVideo}
                        handleUpdateBonusVideo={handleUpdateBonusVideo}
                      /> 
                      : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
};

export default BonusVideoFormHolder;

