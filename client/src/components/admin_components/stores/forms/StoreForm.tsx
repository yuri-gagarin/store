import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

type Props = {
  title: string;
  description: string;
  handleCreateStore(title: string, description: string): void;
  handleUpdateStore(title: string, description: string): void;
}
type FormState = {
  title: string;
  description: string;
}

const StoreForm: React.FC<Props> = ({ title, description, handleCreateStore, handleUpdateStore }): JSX.Element => {

  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ title, description });
  const storeFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
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

  useEffect(() => {
    if (title && description) {
      setNewForm(false);
    } else {
      setNewForm(true);
    }
  },  [title, description]);

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
            onChange={handleTitleChange} 
            placeholder="Store title here ..." 
            value={formState.title}
          />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Store Description'
          onChange={hadnleDescriptionChange}
          placeholder='Store description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button type='submit' onClick={handleSubmit} content= "Create Store" />
            : <Button type='submit' onClick={handleSubmit} content= "Update Store" />
         }  
      </Form>
    </div>
  );
};

export default StoreForm;