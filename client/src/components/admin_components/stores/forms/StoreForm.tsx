import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
// type definitions //
import { StoreFormState } from "../type_definitions/storeTypes";

type Props = {
  title: string;
  description: string;
  newForm: boolean;
  handleCreateStore(title: string, description: string): void;
  handleUpdateStore(title: string, description: string): void;
}

const StoreForm: React.FC<Props> = ({ title, description, newForm, handleCreateStore, handleUpdateStore }): JSX.Element => {
  // local state //
  const [ formState, setFormState ] = useState<StoreFormState>({ title, description });
  const storeFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  // local event listeners - handlers //
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      title: e.target.value
    });
  };
  const hadnleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      description: e.target.value
    });
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateStore(formState.title, formState.description);
    } else {
      handleUpdateStore(formState.title, formState.description);
    }
  };
  // lifecycle hooks //
  useEffect(() => {
    if (storeFormRef.current) {
      const elem = storeFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [storeFormRef]);
  
  return (
    <div id="createStoreFormHolder" ref={storeFormRef}>
      <Form id="createStoreForm">
        <Form.Field>
          <label>Store title</label>
          <input 
            id="adminStoreFormTitleInput"
            onChange={handleTitleChange} 
            placeholder="Store title here ..." 
            value={formState.title}
          />
        </Form.Field>
        <Form.Field
          id="adminStoreFormDescInput"
          control={TextArea}
          label='Store Description'
          onChange={hadnleDescriptionChange}
          placeholder='Store description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button type='submit' id="adminStoreFormCreateBtn" onClick={handleSubmit} content= "Create Store" />
            : <Button type='submit' id="adminStoreFormUpdateBtn" onClick={handleSubmit} content= "Update Store" />
         }  
      </Form>
    </div>
  );
};

export default StoreForm;