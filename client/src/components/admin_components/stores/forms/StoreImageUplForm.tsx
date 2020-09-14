import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/storeImgUploadForm.css";
// actions //
import { uploadStoreImage } from "../actions/APIstoreActions";
import { Store } from "../../../../state/Store";

const StoreImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentStoreData } = state.storeState;
  // local state //
  const [ file, setFile ] = useState<File | null>(null);

  // event handlers and listeners //
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentStoreData;
      formData.append("storeImage", file);
      uploadStoreImage(_id, formData, state, dispatch)
        .then((_) => {
          setFile(null);
        })
        .catch((_) => {
          // log error? show error message ? //
        });
    }
  };
  const cancelFile = () => {
    setFile(null);
  };
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
              id="selectStoreImgBtn"
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
              loading={loading}
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

