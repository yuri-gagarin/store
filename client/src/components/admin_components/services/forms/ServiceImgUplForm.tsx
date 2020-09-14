import React, { useState, useContext, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/serviceImgUploadForm.css";
// actions //
import { uploadServiceImage } from "../actions/APIServiceActions";
// state //
import { Store } from "../../../../state/Store";

const ServiceImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentServiceData } = state.serviceState;
  // local file state 
  const [ file, setFile ] = useState<File>();

  // event handlers and listeners //
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentServiceData;
      formData.append("serviceImage", file);
      uploadServiceImage(_id, formData, state, dispatch)
        .then((_) => {
          setFile(undefined)
        })
        .catch(() => {
          // perhaps show error later //
        })
    }
  };
  const cancelFile = () => {
    setFile(undefined);
  };
  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  };
  

  return (
    <div id="serviceImgUplFormHolder">
      <div><p>Image Uploader</p></div>
      <Form id="serviceImgUploadForm">
        {
          !file ?
          <div id="serviceImgInputControlls"> 
            <Button
              id="selectServiceImgBtn"
              as="label"
              content="Choose Image"
              labelPosition="left"
              htmlFor="serviceImgFile"
              icon="file"
              onClick={handleButtonClick}
            />
            <input type="file" id="serviceImgFile" hidden onChange={fileChange} />
          </div>
          : null
        }
        
        {
          file ?  
          <div id="serviceImgUploadControlls">
            <Button 
              id="serviceImgCancelBtn"
              as="label"
              content="Cancel"
              labelPosition="left"
              icon="cancel"
              onClick={cancelFile}
            />
            <Button 
              id="serviceImgUploadBtn"
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

export default ServiceImageUplForm;

