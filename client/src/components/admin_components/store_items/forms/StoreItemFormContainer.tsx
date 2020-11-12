import React, { useContext, useState, useEffect } from "react";
import { Button, Grid, List } from "semantic-ui-react";
// css imports //
import "./css/storeItemFormContainer.css";
// additional components //
import StoreItemForm from "./StoreItemForm";
import StoreItemImgPreviewContainer from "../image_preview/StoreItemImgPreviewContainer";
import StoreItemImgUplForm from "./StoreItemImgUplForm";
import FormErrorComponent from "../../popups/FormErrorComponent";
import LoadingBar from "../../miscelaneous/LoadingBar";
// state //
import { Store } from "../../../../state/Store";
// client routing //
import { RouteComponentProps, withRouter } from "react-router-dom";
// api actions //
import { createStoreItem, editStoreItem } from "../actions/APIStoreItemActions";
import { getAllStores } from "../../stores/actions/APIstoreActions";
// ui actions //
import { openStoreItemForm, closeStoreItemForm } from "../actions/UIStoreItemActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
// types 
import { AxiosError } from "axios";
import { StoreItemFormState, StoreItemData, StoreDropdownData } from "../type_definitions/storeItemTypes";

interface Props extends RouteComponentProps {

}
const StoreItemFormContainer: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentStoreItemData, storeItemFormOpen, error } = state.storeItemState;
  const { storeId, storeName, name, description, details, price, categories, createdAt, editedAt } = currentStoreItemData;
  // local component state //
  // const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);
  const [ storeDropDownData, setStoreDropDownData ] = useState<StoreDropdownData[]>();
  
  // StoreItemForm toggle //
  const toggleForm = () => {
    storeItemFormOpen ? closeStoreItemForm(dispatch) : openStoreItemForm(dispatch);
  };
  // API call handlers CREATE - EDIT //
  const handleCreateStoreItem = ({ storeId, storeName, name, price, description, details, categories }: StoreItemFormState): void => {
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
    createStoreItem(storeItemData, dispatch)
      .then((_) => {
        // storeItem created //
        closeStoreItemForm(dispatch);
        // push to view Item
        // history.push("")
      })
      .catch((_) => {
        // handle error? show some modal? //
      });
  };
  const handleUpdateStoreItem = ({ storeId, storeName,name, description, details, price, categories }: StoreItemFormState): void => {
    const storeItemParams: StoreItemData = {
      storeId, storeName, name, details, description, price, images: currentStoreItemData.images, categories
    };
    editStoreItem(currentStoreItemData._id, storeItemParams, dispatch, state)
      .then((_) => {
        closeStoreItemForm(dispatch);
      })
      .catch((_) => {
        // handle error show modal ? //
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getAllStores(dispatch)
        .then((_) => {
          // handle success //
          const { loadedStores } = state.storeState;
          const storeDropdownData: StoreDropdownData[] = loadedStores.map((store) => {
            return {
              storeId: store._id,
              storeName: store.title
            }
          });
          setStoreDropDownData(storeDropdownData);
          checkSetValues(currentStoreItemData) ? setNewForm(false) : setNewForm(true);
        })
        .catch((_) => {
          // handle error //
        });
      }
    return () => { mounted = false };
  }, []);
  useEffect(() => {
    if (!storeItemFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ storeItemFormOpen ]);
  
  useEffect(() => {
    checkSetValues(currentStoreItemData) ? setNewForm(false) : setNewForm(true);
  }, [ currentStoreItemData]);
  // component return //
  return (
    <div id="storeItemFormContainer">
      { loading ? <LoadingBar /> : null }
      <FormErrorComponent error={error as AxiosError} />
      {
        !newForm ?
          <div id="storeItemFormContainerDetailsContainer">
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="storeItemFormContainerDetail">
                  <h3>Store Item name:</h3>
                  <p>{name}</p>
                </div>
                <div className="storeItemFormContainerDetail">
                  <h3>Store Item price:</h3>
                  <p>{price}</p>
                </div>
                <div className="storeItemFormContainerDetail">
                  <h3>Store Item description:</h3>
                  <p>{description}</p>
                </div>
                <div className="storeItemFormContainerDetail">
                  <h3>Store Item details:</h3>
                  <p>{details}</p>
                </div>
                <div className="storeItemFormContainerCategories">
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
                <div className="storeItemFormContainerTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <StoreItemImgPreviewContainer state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <StoreItemImgUplForm />
          </div>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  id="storeItemFormToggleBtn" 
            onClick={toggleForm} 
            content={ !storeItemFormOpen ? "Open Form" : "Close Form"}
          />
          {
            storeItemFormOpen ? 
              <StoreItemForm 
                storeId={storeId}
                storeName={storeName}
                name={name}
                price={price}
                details={details}
                description={description}
                categories={categories}
                newForm={newForm}
                activeStores={storeDropDownData ? storeDropDownData : []}                
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
// export for render tests //
export { StoreItemFormContainer }
// default export //
export default withRouter(StoreItemFormContainer);

