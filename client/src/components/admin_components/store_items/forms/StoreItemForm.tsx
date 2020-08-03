import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
// additional components //
import StoreItemCategories from "./StoreItemCategories";
import StoreDetails from "./StoreDetails";
import StoreNameDropDown from "./StoreNameDropdown";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// actions and state //

export type FormState = {
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
}

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
  storeItem: IStoreItemData;
  handleCreateStoreItem(data: FormState): void;
  handleUpdateStoreItem(data: FormState): void;
}

const StoreItemForm: React.FC<Props> = ({ storeItem, handleCreateStoreItem, handleUpdateStoreItem }): JSX.Element => {
  const { storeId, storeName, name, description, details, price, categories } = storeItem;
  // state and refs //
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ storeId, storeName, name, description, details, price, categories });
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
    })
  };
  const handleCategoryChange = (category: string): void => {

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
    if (name && description && price) {
      setNewForm(false);
    } else {
      setNewForm(true);
    }
  },  [name, description, price]);

  useEffect(() => {
    if (storeItemFormRef.current) {
      const elem = storeItemFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [storeItemFormRef]);
  
  return (
    <div className="createStoreItemFormHolder" ref={storeItemFormRef}>
      <Form id="createStoreItemForm">
        {
          (storeId && storeName) ? <StoreDetails /> : null
        }
        <Form.Field>
          <label>Store Name to associate the item</label>
          <StoreNameDropDown />
        </Form.Field>
        <Form.Field>
          <label>Store Name for the item</label>
          <input 
            onChange={handleTitleChange} 
            placeholder="Store Item name here ..." 
            value={formState.storeId}
          />
        </Form.Field>
        <Form.Field>
          <label>Store Item name</label>
          <input 
            onChange={handleTitleChange} 
            placeholder="Store Item name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Store Item price</label>
          <input 
            onChange={handlePriceChange} 
            placeholder="Store Item price here..." 
            value={formState.price}
          />
        </Form.Field>
        <StoreItemCategories _handleCategoryChange={handleCategoryChange} />
        <Form.Field
          control={TextArea}
          label='Store Item Details'
          onChange={hadnleDescriptionChange}
          placeholder='Store Item details here...'
          value={formState.description}
         />
        <Form.Field
          control={TextArea}
          label='Store Item Description'
          onChange={hadnleDescriptionChange}
          placeholder='Store Item description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button type='submit' onClick={handleSubmit} content= "Create  New Store Item" />
            : <Button type='submit' onClick={handleSubmit} content= "Update Store Item" />
         }  
      </Form>
    </div>
  );
};

export default StoreItemForm;