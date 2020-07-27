import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/storeItemImgUploadForm.css";
// actions //
import { uploadStoreItemImage } from "../actions/APIStoreItemActions";
// state //
import { Store } from "../../../../state/Store";

const StoreItemImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ file, setFile ] = useState<File>();
  const { currentStoreItemData } = state.storeItemState;
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentStoreItemData;
      formData.append("storeItemImage", file);
      uploadStoreItemImage(_id, formData, state, dispatch)
        .then((success) => {
          if (success) {
            setFile(undefined)
          }
        })
    }
  }
  const cancelFile = () => {
    setFile(undefined);
  }

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  };

  return (
    <div id="storeItemImgUplFormHolder">
      <div><p>Image Uploader</p></div>
      <Form id="storeItemImgUploadForm">
        {
          !file ?
          <div id="storeItemImgInputControlls"> 
            <Button
              as="label"
              content="Choose Image"
              labelPosition="left"
              htmlFor="storeItemImgFile"
              icon="file"
              onClick={handleButtonClick}
            />
            <input type="file" id="storeItemImgFile" hidden onChange={fileChange} />
          </div>
          : null
        }
        
        {
          file ?  
          <div id="storeItemImgUploadControlls">
            <Button 
              id="storeItemImgCancelBtn"
              as="label"
              content="Cancel"
              labelPosition="left"
              icon="cancel"
              onClick={cancelFile}
            />
            <Button 
              id="storeItemImgUploadBtn"
              as="label"
              content="Upload"
              icon="upload"
              onClick={uploadFile}
            />
          </div>
          : null
        }
       

       <span>{file ? file.name : "No File"}</span>
      </Form>
    </div>
  );
};

export default StoreItemImageUplForm;

