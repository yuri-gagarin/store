import React from "react";
import { Button, Checkbox, Form, TextArea } from "semantic-ui-react";
// css imports //
import "./css/createStoreForm.css";
import StoreImgPreviewHolder from "./StoreImgPreviewThumbs";

const CreateStoreForm: React.FC<{}> = (props): JSX.Element => {
  return (
    <div id="createStoreFormHolder">
      <Form id="createStoreForm">
        <Form.Field>
          <label>Store title</label>
          <input placeholder="Store title here ..." />
        </Form.Field>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Store Description'
          placeholder='Store description here...'
         />
        <Form.Field>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button type='submit'>Save Store</Button>
      </Form>
      <StoreImgPreviewHolder />
    </div>
  );
};

export default CreateStoreForm;

