import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/storeImgUploadForm.css";

const StoreImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const [ file, setFile ] = useState<File>();

  const handleButtonClick = () => {

  };
  const uploadFile = () => {

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

