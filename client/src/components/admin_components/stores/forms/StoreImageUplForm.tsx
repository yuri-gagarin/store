import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/storeImgUploadForm.css";
// actions //
import { uploadStoreImage } from "../actions/APIstoreActions";
import { Store } from "../../../../state/Store";

const StoreImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ file, setFile ] = useState<File>();
  const { currentStoreData } = state.storeState;
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentStoreData;
      formData.append("storeImage", file);
      uploadStoreImage(_id, formData, state, dispatch)
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
    <div id="storeImgUplFormHolder">
      <div><p>Image Uploader</p></div>
      <Form id="storeImgUploadForm">
        {
          !file ?
          <div id="storeImgInputControlls"> 
            <Button
              as="label"
              content="Choose Image"
              labelPosition="left"
              htmlFor="storeImgFile"
              icon="file"
              onClick={handleButtonClick}
            />
            <input type="file" id="storeImgFile" hidden onChange={fileChange} />
          </div>
          : null
        }
        
        {
          file ?  
          <div id="storeImgUploadControlls">
            <Button 
              id="storeImgCancelBtn"
              as="label"
              content="Cancel"
              labelPosition="left"
              icon="cancel"
              onClick={cancelFile}
            />
            <Button 
              id="storeImgUploadBtn"
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

export default StoreImageUplForm;

