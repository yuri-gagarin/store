import React, { useContext, useState, useEffect } from "react";
import { Button, Grid, List } from "semantic-ui-react";
// css imports //
import "./css/storeItemFormHolder.css";
// additional components //
import StoreItemForm from "./StoreItemForm";
import StoreItemImgPreviewHolder from "../image_preview/StoreItemImgPreviewHolder";
import StoreItemImgUplForm from "./StoreItemImgUplForm";
import FormErrorComponent from "../../popups/FormErrorComponent";
import LoadingBar from "../../miscelaneous/LoadingBar";
// state //
import { Store } from "../../../../state/Store";
// api actions //
import { createStoreItem, editStoreItem } from "../actions/APIStoreItemActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
// types 
import { FormState } from "./StoreItemForm";
import { AxiosError } from "axios";

interface Props {
  
}

type StoreItemData = {
  storeId: string,
  storeName: string,
  name: string;
  description: string;
  details: string;
  price: string;
  images: IStoreItemImgData[];
  categories: string[];
}

const StoreItemFormHolder: React.FC<Props> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentStoreItemData, error } = state.storeItemState;
  const { name, description, details, price, categories, createdAt, editedAt } = currentStoreItemData;
  // local component state //
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);
  
  // StoreItemForm toggle //
  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };
  // API call handlers CREATE - EDIT //
  const handleCreateStoreItem = ({ storeId, storeName, name, price, description, details, categories }: FormState): void => {
    const storeItemData: StoreItemData = {
      storeId,
      storeName,
      name,
      description,
      details,
      price,
      images: currentStoreItemData.images,
      categories,
    };
    console.log(60)
    createStoreItem(storeItemData, dispatch)
      .then((_) => {
        // storeItem created //
        setFormOpen(false);
      })
      .catch((_) => {
        // handle error? show some modal? //
      });
  };
  const handleUpdateStoreItem = ({ storeId, storeName,name, description, details, price, categories }: FormState): void => {
    const storeItemParams: StoreItemData = {
      storeId, storeName, name, details, description, price, images: currentStoreItemData.images, categories
    };
    editStoreItem(currentStoreItemData._id, storeItemParams, dispatch, state)
      .then((_) => {
        setFormOpen(false);
      })
      .catch((_) => {
        // handle error show modal ? //
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    if (!formOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formOpen])
  useEffect(() => {
    if (name && description && price) {
      setNewForm(false);
      setFormOpen(true);
    }
  }, [name, description, price]);
  useEffect(() => {
    console.log(loading)
  }, [ loading ])
  // component return //
  return (
    <div id="storeItemFormHolder">
      { loading ? <LoadingBar /> : null }
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
                          <List.Item key={category}>
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

