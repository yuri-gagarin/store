import React, { useState, useContext, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
// css imports //
import "./css/productImgUploadForm.css";
// actions //
import { uploadProductImage } from "../actions/APIProductActions";
// state //
import { Store } from "../../../../state/Store";

const ProductImageUplForm: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentProductData } = state.productState;
  // local state //
  const [ file, setFile ] = useState<File>();
  const [ imageUploadError, setImageUploadError ] = useState<boolean>(false);
  // event handlers and listeners //
  const handleButtonClick = () => {

  };
  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      const { _id } = currentProductData;
      formData.append("productImage", file);
      uploadProductImage(_id, formData, state, dispatch)
        .then((_) => {
          setFile(undefined);
        })
        .catch((_) => {
          // handle error ? display message ? //
          setImageUploadError(true);
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
    <div id="productImgUplFormHolder">
      <div><p>Image Uploader</p></div>
      <Form id="productImgUploadForm">
        {
          !file ?
          <div id="productImgInputControlls"> 
            <Button
              id="productImgSelectBtn"
              as="label"
              content="Choose Image"
              labelPosition="left"
              htmlFor="productImgFile"
              icon="file"
              onClick={handleButtonClick}
            />
            <input type="file" id="productImgFile" hidden onChange={fileChange} />
          </div>
          : null
        }
        
        {
          file ?  
          <div id="productImgUploadControlls">
            <Button 
              id="productImgCancelBtn"
              as="label"
              content="Cancel"
              labelPosition="left"
              icon="cancel"
              onClick={cancelFile}
            />
            {
              imageUploadError ? 
                <Button
                  id="productImgRetryButton"
                  as="label"
                  content="Retry Img Upload"
                  icon="upload"
                  onClick={uploadFile}
                  loading={loading}
                /> 
              : 
                <Button 
                  id="productImgUploadBtn"
                  as="label"
                  content="Upload"
                  icon="upload"
                  onClick={uploadFile}
                  loading={loading}
                />
            }
          </div>
          : null
        }
       <span>{file ? file.name : "No File"}</span>
      </Form>
    </div>
  );
};

export default ProductImageUplForm;

