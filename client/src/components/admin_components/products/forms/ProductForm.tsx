import React, { useState, useEffect, useRef, memo }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
// type definitions//
import { ProductFormState } from "../type_definitions/productTypes";

interface Props {
  name: string;
  price: string;
  description: string;
  details: string;
  newForm: boolean;
  handleCreateProduct(data: ProductFormState): void;
  handleUpdateProduct(data: ProductFormState): void;
}
const ProductForm: React.FC<Props> = (props): JSX.Element => {
  const { name, price, description, details, newForm, handleCreateProduct, handleUpdateProduct } = props;
  // local form state //
  const [ formState, setFormState ] = useState<ProductFormState>({ 
    name: name, price: price, description: description, details: details 
  });
  // form ref //
  const productFormRef = useRef(document.createElement("div"));
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
    newForm ? handleCreateProduct(formState) : handleUpdateProduct(formState);
  };
  
  useEffect(() => {
    if (productFormRef) {
      const elem = productFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [ productFormRef ]);

  return (
    <div className="productFormDiv" ref={productFormRef}>
      <Form id="productForm">
        <Form.Field>
          <label>Product name</label>
          <input 
            id="adminProductFormNameInput"
            onChange={handleNameChange} 
            placeholder="Product name here ..." 
            value={formState.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Product price</label>
          <input 
            id="adminProductFormPriceInput"
            onChange={handlePriceChange} 
            placeholder="Product price here..." 
            value={formState.price}
          />
        </Form.Field>
        <Form.Field
          id='adminProductFormDescInput'
          control={TextArea}
          label='Product Description'
          onChange={hadnleDescriptionChange}
          placeholder='Product description here...'
          value={formState.description}
          />
        <Form.Field
          id='adminProductFormDetailsInput'
          control={TextArea}
          label='Product Details'
          onChange={handleDetailsChange}
          placeholder='Product details here...'
          value={formState.details}
        />
      </Form>
      {
        newForm 
          ? <Button 
              id="adminProductFormCreate" 
              type="button"
              onClick={handleSubmit} 
              content= "Create  New Product" 
            />
          : <Button 
            id="adminProductFormUpdate" 
            type='button'
            onClick={handleSubmit} 
            content="Update Product" 
          />
      }  
    </div>
  );
}

export default ProductForm;