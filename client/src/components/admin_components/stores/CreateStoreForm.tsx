import React, { useContext, useState } from "react";
import { Button, Checkbox, Form, TextArea } from "semantic-ui-react";
// css imports //
import "./css/createStoreForm.css";
import StoreImgPreviewHolder from "./StoreImgPreviewThumbs";
// state //
import { Store } from "../../../state/Store";
// api actions //
import { createStore } from "./api_handlers/storeActions";

type FormState = {
  title: string;
  description: string;
}

const CreateStoreForm: React.FC<{}> = (props): JSX.Element => {
  const [ formState, setFormState ] = useState<FormState>({ title: "", description: "" });
  const { dispatch } = useContext(Store);

  const handleCreateStore = (): void => {
    const storePams = {
      title: formState.title,
      description: formState.description,
      images: [""]
    };
    createStore(storePams, dispatch)
      .then((success) => {
        if (success) {
          // store created //
        } else {

        }
      });
  };

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

  return (
    <div id="createStoreFormHolder">
      <Form id="createStoreForm">
        <Form.Field>
          <label>Store title</label>
          <input onChange={handleTitleChange} placeholder="Store title here ..." />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Store Description'
          onChange={hadnleDescriptionChange}
          placeholder='Store description here...'
         />
        <Button type='submit' onClick={handleCreateStore}>Create Store</Button>
      </Form>
      <StoreImgPreviewHolder />
    </div>
  );
};

export default CreateStoreForm;

