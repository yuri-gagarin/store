import React, { useState, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
// css imports //
import "./css/storeFormHolder.css";
// additional components //
import StoreForm from "./StoreForm";
import StoreImgPreviewHolder from "../image_preview/StoreImgPreviewThumbs";
import StoreImageUplForm from "./StoreImageUplForm";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// api actions //
import { createStore, editStore } from "../actions/APIstoreActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreFormHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ imgUpload, setImgUpload ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  const { currentStoreData } = state.storeState;
  const { title, description } = currentStoreData;

  const handleCreateStore = (title: string, description: string): void => {
    const storePams = {
      title,
      description,
      storeImages: currentStoreData.images
    };
    createStore(storePams, dispatch)
      .then((success) => {
        if (success) {
          // store created //
          setImgUpload(true);
        } else {
          console.error("error");
        }
      });
  };

  const handleUpdateStore = (title: string, description: string): void => {
    const storeParams = {
      title, description, storeImages: currentStoreData.images
    }
    editStore(currentStoreData._id, storeParams, dispatch, state)
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
    console.log("form loaded")
  }, []);

  useEffect(() => {
    if (!formOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formOpen])
  useEffect(() => {
    if (title && description) {
      setNewForm(false);
    }
  }, [title, description]);


  return (
    <div id="storeFormHolder">
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="storeFormHolderDetails">
                  <h3>Store title:</h3>
                  <p>{currentStoreData.title}</p>
                </div>
                <div className="storeFormHolderDetails">
                  <h3>Store description:</h3>
                  <p>{currentStoreData.description}</p>
                </div>
                <div className="storeFormHolderTimestamps">
                  <span>Created At: {ConvertDate.international(currentStoreData.createdAt)}</span>
                  <span>Edited At: {ConvertDate.international(currentStoreData.editedAt)}</span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <StoreImgPreviewHolder state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <StoreImageUplForm />
          </React.Fragment>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  id="storeFormToggleBtn" onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
          {
            formOpen ? <StoreForm 
                        title={title} 
                        description={description} 
                        handleCreateStore={handleCreateStore}
                        handleUpdateStore={handleUpdateStore}
                      /> 
                      : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
}

export default StoreFormHolder;

