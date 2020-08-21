import React, { useState, useEffect } from "react";
import { Button, Grid, List } from "semantic-ui-react";
// css imports //
import "./css/storeItemFormHolder.css";
// additional components //
import StoreItemForm from "./StoreItemForm";
import StoreItemImgPreviewHolder from "../image_preview/StoreItemImgPreviewHolder";
import StoreItemImgUplForm from "./StoreItemImgUplForm";
import FormErrorComponent from "../../popups/FormErrorComponent";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// api actions //
import { createStoreItem, editStoreItem } from "../actions/APIStoreItemActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
// types 
import { FormState } from "./StoreItemForm";
import { AxiosError } from "axios";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

type StoreItemData = {
  storeId: string,
  storeName: string,
  name: string;
  description: string;
  details: string;
  price: string;
  storeItemImages: IStoreItemImgData[];
  categories: string[];
}

const StoreItemFormHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ imgUpload, setImgUpload ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  const { currentStoreItemData, error } = state.storeItemState;
  const { name, description, details, price, categories, createdAt, editedAt } = currentStoreItemData;

  const handleCreateStoreItem = ({ storeId, storeName, name, price, description, details, categories }: FormState): void => {
    const storeItemData: StoreItemData = {
      storeId,
      storeName,
      name,
      description,
      details,
      price,
      storeItemImages: currentStoreItemData.images,
      categories,
    };

    createStoreItem(storeItemData, dispatch)
      .then((success) => {
        if (success) {
          // storeItem created //
          setImgUpload(true);
        } else {
          console.error("error");
        }
      });
  };

  const handleUpdateStoreItem = ({ storeId, storeName,name, description, details, price, categories }: FormState): void => {
    const storeItemParams: StoreItemData = {
      storeId, storeName, name, details, description, price, storeItemImages: currentStoreItemData.images, categories
    };

    editStoreItem(currentStoreItemData._id, storeItemParams, dispatch, state)
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
    if (name && description && price) {
      setNewForm(false);
    }
  }, [name, description, price]);


  return (
    <div id="storeItemFormHolder">
      <FormErrorComponent error={error as AxiosError} />
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="storeItemFormHolderDetails">
                  <h3>Store Item name:</h3>
                  <p>{name}</p>
                </div>
                <div className="storeItemFormHolderPrice">
                  <h3>Store Item price:</h3>
                  <p>{price}</p>
                </div>
                <div className="storeItemFormHolderDetails">
                  <h3>Store Item description:</h3>
                  <p>{description}</p>
                </div>
                <div className="storeItemFormHolderDetails">
                  <h3>Store Item details:</h3>
                  <p>{details}</p>
                </div>
                <div className="storeItemFormHolderCategories">
                  <h3>Listed Store Item categories: </h3>
                  { categories.length === 0 ? "no categories listed" : null}
                  <List horizontal>
                    {
                      categories.map((category) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <List.Header>{category}</List.Header>
                            </List.Content>
                          </List.Item>
                        )
                      })
                    }
                  </List>
                </div>
                <div className="storeItemFormHolderTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <StoreItemImgPreviewHolder state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <StoreItemImgUplForm />
          </React.Fragment>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  id="storeItemFormToggleBtn" onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
          {
            formOpen ? <StoreItemForm 
                        state={state}
                        dispatch={dispatch}
                        storeItem={currentStoreItemData}
                        handleCreateStoreItem={handleCreateStoreItem}
                        handleUpdateStoreItem={handleUpdateStoreItem}
                      /> 
                      : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
};

export default StoreItemFormHolder;

