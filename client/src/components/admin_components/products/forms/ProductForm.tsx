import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

export type FormState = {
  name: string;
  description: string;
  details: string;
  price: string;
}

interface Props {
  name: string;
  price: string;
  description: string;
  details: string;
  newForm: boolean;
  handleCreateProduct(data: FormState): void;
  handleUpdateProduct(data: FormState): void;
}
const ProductForm: React.FC<Props> = ({ name, price, description, details, newForm, handleCreateProduct, handleUpdateProduct }): JSX.Element => {
  // local form state //
  const [ formState, setFormState ] = useState<FormState>({ name, price, description, details });
  // form ref //
  const productFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
  // form state changes listeners //
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      name: e.target.value
    });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      price: e.target.value
    });
  };
  const hadnleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      description: e.target.value
    });
  };
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      details: e.target.value
    });
  };
  // submit action //
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateProduct(formState);
    } else {
      handleUpdateProduct(formState);
    }
  };
  // lifecycle hooks //
  useEffect(() => {
    if (productFormRef.current) {
      const elem = productFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [productFormRef]);
  
  return (
    <div className="productFormDiv" ref={productFormRef}>
      <Form id="productForm">
        <Form.Field>
          <label>Product name</label>
          <input 
            id="productFormNameInput"
            onChange={handleNameChange} 
            placeholder="Product name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Product price</label>
          <input 
            id="productFormPriceInput"
            onChange={handlePriceChange} 
            placeholder="Product price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field
          id='productFormDescInput'
          control={TextArea}
          label='Product Description'
          onChange={hadnleDescriptionChange}
          placeholder='Product description here...'
          value={formState.description}
         />
         <Form.Field
          id='productFormDetailsInput'
          control={TextArea}
          label='Product Details'
          onChange={handleDetailsChange}
          placeholder='Product details here...'
          value={formState.details}
         />
         {
           newForm 
            ? <Button 
                id="adminProductFormCreate" 
                type='submit' 
                onClick={handleSubmit} 
                content= "Create  New Product" 
              />
            : <Button 
              id="adminProductFormUpdate" 
              type='submit' 
              onClick={handleSubmit} 
              content="Update Product" 
            />
         }  
      </Form>
    </div>
  );
};

export default ProductForm;