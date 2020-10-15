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
  const { loading, currentStoreItemData } = state.storeItemState;
  // local component state //
  const [ file, setFile ] = useState<File>();
  const [ imgUploadError, setImgUploadError ] = useState<boolean>(false);
  // event handlers and listeners //
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentStoreItemData;
      formData.append("storeItemImage", file);
      uploadStoreItemImage(_id, formData, state, dispatch)
        .then((_) => {
          setFile(undefined);
          setImgUploadError(false);
        })
        .catch((_) => {
          // handle error ? show error screen? for later ... //
          setImgUploadError(true);
        });
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
    <div id="storeItemImgUplFormHolder">
      <div><p>Image Uploader</p></div>
      <Form id="storeItemImgUploadForm">
        {
          file ?  
          <div id="storeItemImgUploadControlls">
            {
              !imgUploadError ?
              <Button 
                id="storeItemImgUploadBtn"
                as="label"
                content="Upload"
                icon="upload"
                onClick={uploadFile}
                loading={loading}
              />
              :
              <Button 
                id="storeItemImgUplRetryBtn"
                as="label"
                content="Cancel"
                labelPosition="left"
                icon="cancel"
                onClick={cancelFile}
                loading={loading}
              />
            }
            <Button 
              id="storeItemImgCancelBtn"
              as="label"
              content="Cancel"
              labelPosition="left"
              icon="cancel"
              onClick={cancelFile}
            />
          </div>
          : 
          <div id="storeItemImgInputControlls"> 
            <Button
              id="storeItemImgSelectBtn"
              as="label"
              content="Choose Image"
              labelPosition="left"
              htmlFor="storeItemImgFile"
              icon="file"
              onClick={handleButtonClick}
            />
            <input type="file" id="storeItemImgFile" hidden onChange={fileChange} />
          </div>
        }
       

       <span>{file ? file.name : "No File"}</span>
      </Form>
    </div>
  );
};

export default StoreItemImageUplForm;

