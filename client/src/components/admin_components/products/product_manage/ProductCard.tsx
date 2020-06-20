import React, { useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import EditControls from "./EditControls"
// css imports //
import "./css/productCard.css";
// actions and state /
import { deleteProduct } from "../actions/APIProductActions";
import { setCurrentProduct, clearCurrentProduct } from "../actions/UIProductActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps } from "react-router-dom";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props extends RouteComponentProps {
  product: IProductData;
  imageCount: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const ProductCard: React.FC<Props> = ({ product, imageCount, state, dispatch, history }): JSX.Element => {
  const [ editing, setEditing ] = useState<boolean>(false);
  const baseUrl = "/admin/home/my_productss/manage"
  const { _id, name, price, description, images, createdAt, editedAt } = product;

  const handleProductOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
    history.push(baseUrl + "/view");
  }
  const handleProductEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!editing) {
      setCurrentProduct(_id, dispatch, state);
      history.push(baseUrl + "/edit");
      setEditing(true);
    } else {
      clearCurrentProduct(dispatch);
      history.push(baseUrl);
      setEditing(false);
    }
  }
  const handleProductDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    deleteProduct( _id, dispatch, state)
      .then((success) => {
        
      })
  }

  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
        <div className="productManageDesc">
          <h3>Name: {name}</h3>
          <p><strong>Description:</strong> {description}</p>
          <span>Number of Images: <strong>{imageCount}</strong></span>
          <p><span>Created At: </span>{ConvertDate.international(createdAt)}</p>
        </div> 
        <div className="productManageCtrls">
          <Button 
            inverted
            color="green"
            className="productCardBtn" 
            content="Open" 
            onClick={handleProductOpen} 
          />
          <Button 
            inverted
            color="orange"
            className="productCardBtn" 
            content="Edit" 
            onClick={handleProductEdit}  
          />
          <Button 
            inverted
            color="red"
            className="productCardBtn" 
            content="Delete" 
            onClick={handleProductDelete}
          />
        </div> 
      </Grid.Row>
      {  editing ?  <EditControls handleProductEdit={handleProductEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(ProductCard);