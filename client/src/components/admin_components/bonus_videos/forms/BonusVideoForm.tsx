import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

export type FormState = {
  description: string;
  youTubeURL: string;
  vimeoURL: string;
}

interface Props {
  description: string;
  youTubeURL: string;
  vimeoURL: string;
  handleCreateProduct(data: FormState): void;
  handleUpdateProduct(data: FormState): void;
}


const ProductForm: React.FC<Props> = ({ description, youTubeURL, vimeoURL, handleCreateProduct, handleUpdateProduct }): JSX.Element => {
  
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ description, youTubeURL, vimeoURL });
  const bonusVideoFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
  const handleYouTubeURLChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      youTubeURL: e.target.value
    });
  };
  const handleVimeoURLChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      vimeoURL: e.target.value
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
      handleCreateProduct(formState);
    } else {
      handleUpdateProduct(formState);
    }
  };

  useEffect(() => {
    if (description || youTubeURL || vimeoURL) {
      setNewForm(false);
    } else {
      setNewForm(true);
    }
  },  [description, youTubeURL, vimeoURL]);

  useEffect(() => {
    if (bonusVideoFormRef.current) {
      const elem = bonusVideoFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [bonusVideoFormRef]);
  
  return (
    <div className="createProductFormHolder" ref={bonusVideoFormRef}>
      <Form id="createProductForm">
        <Form.Field>
          <label>Video YouTube URL:</label>
          <input 
            onChange={handleYouTubeURLChange} 
            placeholder="YouTube URL here ..." 
            value={formState.youTubeURL}
          />
        </Form.Field>
        <Form.Field>
          <label>Video Vimeo URL:</label>
          <input 
            onChange={handleVimeoURLChange} 
            placeholder="Vimeo URL here..." 
            value={formState.vimeoURL}
          />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Video Description'
          onChange={hadnleDescriptionChange}
          placeholder='Video description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button type='submit' onClick={handleSubmit} content= "Save New Bonus Video" />
            : <Button type='submit' onClick={handleSubmit} content= "Update Bonus Video" />
         }  
      </Form>
    </div>
  );
};

export default ProductForm;