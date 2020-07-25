import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

export type FormState = {
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
}

interface Props {
  storeItem: IStoreItemData;
  handleCreateStoreItem(data: FormState): void;
  handleUpdateStoreItem(data: FormState): void;
}


const StoreItemForm: React.FC<Props> = ({ storeItem, handleCreateStoreItem, handleUpdateStoreItem }): JSX.Element => {
  const { name, description, details, price, categories } = storeItem;
  // state and refs //
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ name, description, details, price, categories });
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
        <Form.Field
          id='form-textarea-control-opinion'
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