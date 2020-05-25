import React, { useContext, useState, useEffect } from "react";
import { Button, Grid, Form, TextArea } from "semantic-ui-react";
// css imports //
import "./css/storeFormHolder.css";
import StoreImgPreviewHolder from "../StoreImgPreviewThumbs";
import StoreImageUplForm from "../StoreImageUplForm";
// state //
import { Store } from "../../../../state/Store";
// api actions //
import { createStore, editStore } from "../actions/APIstoreActions";
import { setCurrentStore } from "../actions/uiStoreActions";

type FormState = {
  title: string;
  description: string;
}

const StoreFormHolder: React.FC<{}> = (props): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ imgUpload, setImgUpload ] = useState<boolean>(false);
  const { dispatch, state } = useContext(Store);
  const { currentStoreData } = state.storeState;
  const { title, description } = currentStoreData;

  const handleCreateStore = (title: string, description: string): void => {
    const storePams = {
      title,
      description,
      storeImages: [""]
    };
    createStore(storePams, dispatch)
      .then((success) => {
        if (success) {
          // store created //
          setImgUpload(true);
        } else {
          console.error("error");
        }
      });
  };

  const handleUpdateStore = (title: string, description: string): void => {
    const storeParams = {
      title, description, storeImages: [""]
    }
    editStore(currentStoreData._id, storeParams, dispatch, state)
      .then((success) => {
        if (success) {
          setFormOpen(false);
        }
      })
  }

  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };

  useEffect(() => {
    if (title && description && formOpen) {
      setImgUpload(true);
    }
  }, [title, description, formOpen])

  return (
    <div id="storeFormHolder">
      <Grid centered>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={14} computer={14}>
            <h1>Store Details</h1>
            <h3>{currentStoreData.title}</h3>
            <h3>{currentStoreData.description}</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={14} computer={14}>
            <StoreImgPreviewHolder />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={15} computer={14}>
            <Button onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
            {
              formOpen ? <StoreForm 
                          title={title} 
                          description={description} 
                          handleCreateStore={handleCreateStore}
                          handleUpdateStore={handleUpdateStore}
                        /> 
                        : null
            }
            {
              imgUpload ? <StoreImageUplForm /> : null
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

type StoreFormProps = {
  title: string;
  description: string;
  handleCreateStore(title: string, description: string): void;
  handleUpdateStore(title: string, description: string): void;
}
const StoreForm: React.FC<StoreFormProps> = ({ title, description, handleCreateStore, handleUpdateStore }): JSX.Element => {

  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ title, description });
  

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
  
  return (
    <div id="createStoreFormHolder">
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

export default StoreFormHolder;

