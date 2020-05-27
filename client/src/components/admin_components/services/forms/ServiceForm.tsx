import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

type FormState = {
  name: string;
  description: string;
  price: string;
}

type Props = {
  name: string;
  description: string;
  price: string;
  handleCreateService(data: FormState): void;
  handleUpdateService(data: FormState): void;
}


const ServiceForm: React.FC<Props> = ({ name, description, price, handleCreateService, handleUpdateService }): JSX.Element => {
  
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ name, description, price });
  const serviceFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateService(formState);
    } else {
      handleUpdateService(formState);
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
    if (serviceFormRef.current) {
      const elem = serviceFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [serviceFormRef]);
  
  return (
    <div className="createServiceFormHolder" ref={serviceFormRef}>
      <Form id="createStoreForm">
        <Form.Field>
          <label>Service name</label>
          <input 
            onChange={handleTitleChange} 
            placeholder="Service name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Service price</label>
          <input 
            onChange={handlePriceChange} 
            placeholder="Service price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Store Description'
          onChange={hadnleDescriptionChange}
          placeholder='Service description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button type='submit' onClick={handleSubmit} content= "Create  New Service" />
            : <Button type='submit' onClick={handleSubmit} content= "Update Service" />
         }  
      </Form>
    </div>
  );
};

export default ServiceForm;