import React, { useContext, useState } from "react";
import { Button, Grid, Form, TextArea } from "semantic-ui-react";
// css imports //
import "./css/createStoreForm.css";
import StoreImgPreviewHolder from "./StoreImgPreviewThumbs";
import StoreImageUplForm from "./StoreImageUplForm";
// state //
import { Store } from "../../../state/Store";
// api actions //
import { createStore } from "./api_handlers/storeActions";

type FormState = {
  title: string;
  description: string;
}

const StoreManageHolder: React.FC<{}> = (props): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState(false);
  const { storeState } = useContext(Store).state;
  const { currentStoreData } = storeState;
  const { title, description } = storeState.currentStoreData;
  const { dispatch } = useContext(Store);

  const handleCreateStore = (title: string, description: string): void => {
    const storePams = {
      title,
      description,
      images: [""]
    };
    createStore(storePams, dispatch)
      .then((success) => {
        if (success) {
          // store created //
          setFormOpen(false);
        } else {
          console.error("error");
        }
      });
  };

  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };

  return (
    <div>
      <Grid centered>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={14} computer={14}>
            <h1>Store Details</h1>
            <h3>{currentStoreData.title}</h3>
            <h3>{currentStoreData.description}</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={15} computer={14}>
            <Button onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Cancel"}></Button>
            {
              formOpen ? <CreateStoreForm title={title} description={description} handleCreateStore={handleCreateStore}/> : null
            }
            {
              formOpen ? <StoreImageUplForm /> : null

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
}
const CreateStoreForm: React.FC<StoreFormProps> = ({ title, description, handleCreateStore }): JSX.Element => {
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
    handleCreateStore(formState.title, formState.description);
  }
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
        <Button type='submit' onClick={handleSubmit}>Create Store</Button>
      </Form>
      <StoreImgPreviewHolder />
    </div>
  );
};

export default StoreManageHolder;

