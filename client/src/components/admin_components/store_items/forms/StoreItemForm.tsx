import React, { useState, useEffect, useRef, useContext }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
// additional components //
import StoreItemCategories from "./StoreItemCategories";
import StoreDetails from "./StoreDetails";
import StoreNameDropDown from "./StoreNameDropdown";
// actions and state //
import { Store } from "../../../../state/Store";
// types //
import { StoreItemFormState, StoreDropdownData } from "../type_definitions/storeItemTypes";


interface Props {
  storeId: string;
  storeName: string;
  name: string;
  price: string;
  description: string;
  details: string;
  categories: string[];
  activeStores: StoreDropdownData[];
  newForm: boolean;
  handleCreateStoreItem(data: StoreItemFormState): void;
  handleUpdateStoreItem(data: StoreItemFormState): void;
}

const StoreItemForm: React.FC<Props> = ( props ): JSX.Element => {
  const { storeId, storeName, name, description, details, price, categories } = props;
  const { activeStores } = props;
  const { newForm } = props;
  const { currentStoreData } = useContext(Store).state.storeState;
  const { handleCreateStoreItem, handleUpdateStoreItem } = props;

  // local state and refs //
  const [ formState, setFormState ] = useState<StoreItemFormState>({ storeId, storeName, name, description, details, price, categories });
  const [ currentStore, setCurrentStore ] = useState<IStoreData>();
  const storeItemFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      name: e.target.value
    });
  };
  const hadnleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      description: e.target.value
    });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      price: e.target.value
    });
  };
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      details: e.target.value
    });
  };
  const handleCategoryChange = (categories: string[]): void => {
    setFormState({
      ...formState,
      categories: [ ...categories ]
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateStoreItem(formState);
    } else {
      handleUpdateStoreItem(formState);
    }
  };

  useEffect(() => {
    if (storeItemFormRef.current) {
      const elem = storeItemFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [storeItemFormRef]);
  useEffect(() => {
    if(!newForm) setCurrentStore(currentStoreData);
  }, [newForm, currentStoreData ])
  
  return (
    <div className="createStoreItemFormHolder" ref={storeItemFormRef}>
      <Form id="createStoreItemForm">
        {
        !newForm ? <StoreDetails storeId={storeId} storeName={storeName} createdAt={currentStore?.createdAt}/> : null
        }
        <Form.Field>
          <label>Which Store to place the item in?</label>
          <StoreNameDropDown activeStores={activeStores} />
        </Form.Field>
        <Form.Field>
          <label>Store Item name</label>
          <input 
            id="storeItemFormNameInput"
            onChange={handleTitleChange} 
            placeholder="Store Item name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Store Item price</label>
          <input 
            id="storeItemFormPriceInput"
            onChange={handlePriceChange} 
            placeholder="Store Item price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field>
          <label>Categories</label>
          <StoreItemCategories _handleCategoryChange={handleCategoryChange} />
        </Form.Field>
        <Form.Field
          id="storeItemFormDetailsInput"
          control={TextArea}
          label='Store Item Details'
          onChange={handleDetailsChange}
          placeholder='Store Item details here...'
          value={formState.details}
         />
        <Form.Field
          id="storeItemFormDescInput"
          control={TextArea}
          label='Store Item Description'
          onChange={hadnleDescriptionChange}
          placeholder='Store Item description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button id="adminStoreItemFormCreate" type='submit' onClick={handleSubmit} content= "Create  New Store Item" />
            : <Button id="adminStoreItemFormUpdate" type='submit' onClick={handleSubmit} content= "Update Store Item" />
         }  
      </Form>
    </div>
  );
};

export default StoreItemForm;