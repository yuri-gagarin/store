import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

export type FormState = {
  name: string;
  description: string;
  price: string;
}

interface Props {
  name: string;
  description: string;
  price: string;
  newForm: boolean;
  handleCreateService(data: FormState): void;
  handleUpdateService(data: FormState): void;
}


const ServiceForm: React.FC<Props> = ({ name, description, price, newForm, handleCreateService, handleUpdateService }): JSX.Element => {
  // local form state and ref //
  const [ formState, setFormState ] = useState<FormState>({ name, description, price });
  const serviceFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  // input change listeners //
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      name: e.target.value
    });
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
  // submit listener //
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateService(formState);
    } else {
      handleUpdateService(formState);
    }
  };
  // lifecycle hooks //
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
    <div className="serviceFormDiv" ref={serviceFormRef}>
      <Form id="serviceForm">
        <Form.Field>
          <label>Service name</label>
          <input 
            id="adminServiceFormNameInput"
            onChange={handleNameChange} 
            placeholder="Service name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Service price</label>
          <input 
            id="adminServiceFormPriceInput"
            onChange={handlePriceChange} 
            placeholder="Service price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field
          id='adminServiceFormDescInput'
          control={TextArea}
          label='Store Description'
          onChange={handleDescriptionChange}
          placeholder='Service description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button id="adminServiceFormCreate" type='submit' onClick={handleSubmit} content= "Create  New Service" />
            : <Button id="adminServiceFormUpdate" type='submit' onClick={handleSubmit} content= "Update Service" />
         }  
      </Form>
    </div>
  );
};

export default ServiceForm;