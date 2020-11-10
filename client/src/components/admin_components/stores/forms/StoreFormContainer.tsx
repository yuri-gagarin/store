import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// client routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/storeFormContainer.css";
// additional components //
import StoreForm from "./StoreForm";
import StoreImgPreviewContainer from "../image_preview/StoreImgPreviewContainer";
import StoreImageUplForm from "./StoreImageUplForm";
import LoadingBar from "../../miscelaneous/LoadingBar";
import ErrorBar from "../../miscelaneous/ErrorBar";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createStore, editStore } from "../actions/APIstoreActions";
import { openStoreForm, closeStoreForm, clearCurrentError } from "../actions/uiStoreActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
import { ClientStoreData, StoreFormState } from "../type_definitions/storeTypes";

interface StoreFormContState {
  storeFormState: StoreFormState;
  newForm: boolean;
}
interface Props extends RouteComponentProps {
}

const StoreFormContainer: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentStoreData, storeFormOpen, error } = state.storeState;
  const { _id, title, description, createdAt, editedAt } = currentStoreData;
  // local component state //
  const [ storeFormContState, setStoreFormContState ] = useState<StoreFormContState>({
    newForm: true,
    storeFormState: { title: "", description: "" }
  });

  // Store form toggle //
  const toggleStoreForm = () => {
    storeFormOpen ? closeStoreForm(dispatch) : openStoreForm(dispatch);
  };
  // clear a store API error //
  const handleClearError = () => {
    clearCurrentError(dispatch);
  }
  // API call handlers CREATE - EDIT //
  const handleCreateStore = (title: string, description: string): void => {
    const storeParams: ClientStoreData = {
      title,
      description,
      images: currentStoreData.images
    };
    createStore(storeParams, dispatch)
      .then((_) => {
        // handle create //
        closeStoreForm(dispatch);
      })
      .catch((_) => {
        // handle error, show modal ? //
        setStoreFormContState({
          newForm: true,
          storeFormState: { ...storeParams }
        });
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
        // save input values //
       
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    if (!storeFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ storeFormOpen ]);
  useEffect(() => {
    if (checkSetValues(currentStoreData)) {
      const { title, description } = currentStoreData;
      setStoreFormContState({
        newForm: false,
        storeFormState: {
          title,
          description
        }
      });
    }
  }, [ currentStoreData ]);
  // component render //
  return (
    <div id="storeFormContainer">
    {
      loading ? <LoadingBar /> : ( error ? <ErrorBar clearError={handleClearError} error={error} /> : null)
    }
    {
      !storeFormContState.newForm ?
        <div id="adminStoreFormContainerDetails">
          <Grid.Row>
            <Grid.Column mobile={16} tablet={14} computer={14}>
              <h1>Details</h1>
              <div className="adminStoreFormContainerDetailsItem">
                <h3>Store title:</h3>
                <p>{title}</p>
              </div>
              <div className="adminStoreFormContainerDetailsItem">
                <h3>Store description:</h3>
                <p>{description}</p>
              </div>
              <div className="storeFormContainerTimestamps">
                <span>Created At: {ConvertDate.international(createdAt)}</span>
                <span>Edited At: {ConvertDate.international(editedAt)}</span>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={14} computer={14}>
              <StoreImgPreviewContainer state={state} dispatch={dispatch} />
            </Grid.Column>
          </Grid.Row>
          <StoreImageUplForm />
        </div>
        : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  
            id="adminStoreFormToggleBtn" 
            onClick={toggleStoreForm} 
            content={ !storeFormOpen ? "Open Form" : "Close Form"}
          />
          {
            storeFormOpen ? 
            <StoreForm 
              newForm={storeFormContState.newForm}
              handleCreateStore={handleCreateStore}
              handleUpdateStore={handleUpdateStore}
              { ...storeFormContState.storeFormState }
            /> 
            : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
}
// export for unit tests - without Router //
export { StoreFormContainer };
// 
export default withRouter(StoreFormContainer);

