import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// client routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/storeFormHolder.css";
// additional components //
import StoreForm from "./StoreForm";
import StoreImgPreviewHolder from "../image_preview/StoreImgPreviewHolder";
import StoreImageUplForm from "./StoreImageUplForm";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createStore, editStore } from "../actions/APIstoreActions";
import { openStoreForm, closeStoreForm } from "../actions/uiStoreActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props extends RouteComponentProps {
}

const StoreFormHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentStoreData, storeFormOpen, error } = state.storeState;
  const { _id: storeId, title, description, createdAt, editedAt} = currentStoreData;
  // local component state //
  const [ newForm, setNewForm ] = useState<boolean>(true);

  // Store form toggle //
  const toggleStoreForm = () => {
    storeFormOpen ? closeStoreForm(dispatch) : openStoreForm(dispatch);
  }
  // API call handlers CREATE - EDIT //
  const handleCreateStore = (title: string, description: string): void => {
    const storePams = {
      title,
      description,
      images: currentStoreData.images
    };
    createStore(storePams, dispatch)
      .then((_) => {
        // handle create //
        closeStoreForm(dispatch);
      })
      .catch((_) => {
        // handle error, show modal ? //
      });
  };

  const handleUpdateStore = (title: string, description: string): void => {
    const storeParams = {
      title, description, images: currentStoreData.images
    };
    editStore(currentStoreData._id, storeParams, dispatch, state)
      .then((_) => {
        closeStoreForm(dispatch);
      })
      .catch((_) => {
        // handle error, show modal ? //
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    if (!storeFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ storeFormOpen ]);
  useEffect(() => {
    if (storeId) {
      setNewForm(false);
      openStoreForm(dispatch);
    }
  }, [ storeId ]);
  // component render //
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
                  <p>{title}</p>
                </div>
                <div className="storeFormHolderDetails">
                  <h3>Store description:</h3>
                  <p>{description}</p>
                </div>
                <div className="storeFormHolderTimestamps">
                  <span>Created At: {ConvertDate.international(createdAt)}</span>
                  <span>Edited At: {ConvertDate.international(editedAt)}</span>
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
          <Button  
            id="storeFormToggleBtn" 
            onClick={toggleStoreForm} 
            content={ !storeFormOpen ? "Open Form" : "Close Form"}
          />
          {
            storeFormOpen ? 
            <StoreForm 
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

export default withRouter(StoreFormHolder);

