import React, { useState, useEffect, useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
// css imports //
import "./css/bonusVideoFormHolder.css";
// additional components //
import BonusVideoForm from "./BonusVideoForm";
import BonusVideoPreview from "../bonus_videos_preview/BonusVideoPreview";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createBonusVideo, editBonusVideo } from "../actions/APIBonusVideoActions";
import { closeBonusVideoForm, openBonusVideoForm } from "../actions/UIBonusVideoActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
// type definitions //
import { BonusVideoData, FormState } from "../type_definitions/bonusVideoTypes"
import { RouteComponentProps } from "react-router-dom";

interface Props { }

const BonusVideoFormHolder: React.FC<Props> = ({ }): JSX.Element => {
  const { state, dispatch} = useContext(Store);
  // data for component //
  const { currentBonusVideoData, bonusVideoFormOpen } = state.bonusVideoState;
  const { description, youTubeURL, vimeoURL, createdAt, editedAt } = currentBonusVideoData;

  // form toggle listener //
  const toggleBonusVidform = () => {
    bonusVideoFormOpen ? closeBonusVideoForm(dispatch) : openBonusVideoForm(dispatch);
  }
  // CREATE - EDIT methods //
  const handleCreateBonusVideo = ({ description, youTubeURL, vimeoURL }: FormState): void => {
    const bonusVideoData: BonusVideoData = {
      description,
      youTubeURL,
      vimeoURL
    };

    createBonusVideo(bonusVideoData, dispatch)
      .then((_) => {
        closeBonusVideoForm(dispatch);
      })
      .catch((_) => {
        // handle error show modal ? //
      });
  };
  const handleUpdateBonusVideo = ({ description, youTubeURL, vimeoURL }: FormState): void => {
    const bonusVideoParams: BonusVideoData = {
      description,
      youTubeURL,
      vimeoURL
    };

    editBonusVideo(currentBonusVideoData._id, bonusVideoParams, dispatch, state)
      .then((_) => {
          closeBonusVideoForm(dispatch)
      })
      .catch((_) => {
        // handle an error or show a modal ? //
      })
  };
  // lifecycle hooks //
  useEffect(() => {
    if (!bonusVideoFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ bonusVideoFormOpen ]);
  // component render //
  return (
    <div id="bonusVideoFormHolder">
      {
        checkSetValues<IBonusVideoData>(currentBonusVideoData) ?
          <React.Fragment>
            <Grid.Row id="bonusVideoFormDetails">
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="bonusVideoFormHolderYouTubeUrl">
                  <h3>Video youTube URL:</h3>
                  <p>{youTubeURL}</p>
                </div>
                <div className="bonusVideoFormHolderVimeoUrl">
                  <h3>Video vimeo URL:</h3>
                  <p>{vimeoURL}</p>
                </div>
                <div className="bonusVideoFormHolderDescription">
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
          <Button  
            id="bonusVideoFormToggleBtn" 
            onClick={toggleBonusVidform} 
            content={ bonusVideoFormOpen ? "Close Form" : "Open Form"}
          />
          {
            bonusVideoFormOpen ? 
            <BonusVideoForm 
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

