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
class ProductForm extends React.Component<Props, ProductFormState> {
  constructor(props: Props) {
    super(props)
    // this.productFormRef = useRef<HTMLDivElement>(document.createElement("div"));
    this.state = {
      name: "",
      price: "",
      description: "",
      details: "",
    }

  }
  // local form state //
  // form ref //
  
  // form state changes listeners //
  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    this.setState({
      ...this.state,
      name: e.target.value
    });
  };
  handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      price: e.target.value
    });
  };
  hadnleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      description: e.target.value
    });
  };
  handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      details: e.target.value
    });
  };
  // submit action //
  handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (this.props.newForm) {
      this.props.handleCreateProduct(this.state);
    } else {
      this.props.handleUpdateProduct(this.state);
    }
  };
  componentDidMount() {

  }
  shouldComponentUpdate(nextProps: Props, nextState: ProductFormState) {
    console.log(nextProps)
    const { name: newName } = nextProps;
    if (newName === this.props.name) {
      console.log("shouldnt");
      return false
    }
    return true;
  }

  // lifecycle hooks //
  /*
  useEffect(() => {
    if (productFormRef.current) {
      const elem = productFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [productFormRef]);
  */
  render() {
    const { name, price, description, details } = this.state;
    const { newForm } = this.props;
    return (
      <div className="productFormDiv">
        <Form id="productForm">
          <Form.Field>
            <label>Product name</label>
            <input 
              id="adminProductFormNameInput"
              onChange={this.handleNameChange} 
              placeholder="Product name here ..." 
              value={name}
            />
          </Form.Field>
          <Form.Field>
            <label>Product price</label>
            <input 
              id="adminProductFormPriceInput"
              onChange={this.handlePriceChange} 
              placeholder="Product price here..." 
              value={price}
            />
          </Form.Field>
          <Form.Field
            id='adminProductFormDescInput'
            control={TextArea}
            label='Product Description'
            onChange={this.hadnleDescriptionChange}
            placeholder='Product description here...'
            value={description}
           />
          <Form.Field
            id='adminProductFormDetailsInput'
            control={TextArea}
            label='Product Details'
            onChange={this.handleDetailsChange}
            placeholder='Product details here...'
            value={details}
          />
        </Form>
        {
          newForm 
            ? <Button 
                id="adminProductFormCreate" 
                type="button"
                onClick={this.handleSubmit} 
                content= "Create  New Product" 
              />
            : <Button 
              id="adminProductFormUpdate" 
              type='button'
              onClick={this.handleSubmit} 
              content="Update Product" 
            />
        }  
      </div>
    );
  }
}

export default ProductForm;