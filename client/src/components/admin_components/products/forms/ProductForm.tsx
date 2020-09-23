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
  handleCreateProduct(data: FormState): void;
  handleUpdateProduct(data: FormState): void;
}


const ProductForm: React.FC<Props> = ({ name, description, price, handleCreateProduct, handleUpdateProduct }): JSX.Element => {
  
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ name, description, price });
  const productFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
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
      handleCreateProduct(formState);
    } else {
      handleUpdateProduct(formState);
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
            onChange={handleTitleChange} 
            placeholder="Product name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Product price</label>
          <input 
            onChange={handlePriceChange} 
            placeholder="Product price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Store Description'
          onChange={hadnleDescriptionChange}
          placeholder='Product description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button id="adminProductFormCreate" type='submit' onClick={handleSubmit} content= "Create  New Product" />
            : <Button id="adminProductFormUpdate" type='submit' onClick={handleSubmit} content= "Update Product" />
         }  
      </Form>
    </div>
  );
};

export default ProductForm;