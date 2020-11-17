import React, { useState } from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
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
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
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
  const [ confirmDeleteOpen, setConfirmDeleteOpen ] = useState<boolean>(false);

  const baseUrl = AdminProductRoutes.MANAGE_ROUTE;
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
  };
  // delete product click and popup //
  const handleDeleteClick = (): void => {
    setConfirmDeleteOpen(true);
  };
  const confirmProductDeleteAction = (): void => {
    const { _id: productId } = product;
    deleteProduct(productId, dispatch, state)
      .then((_) => {
        // action successful //
      })
      .catch((_) => {
        // handle an error //
      });
  };
  const cancelStoreItemDeleteAction = (): void => {
    setConfirmDeleteOpen(false);
  };
 
  return (
    <React.Fragment>
      <Grid.Row style={{ padding: "0.5em", marginTop: "1em" }}>
        <Confirm 
          open={confirmDeleteOpen}
          onCancel={cancelStoreItemDeleteAction}
          onConfirm={confirmProductDeleteAction}
        />
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
            className="productCardEditBtn" 
            content="Edit" 
            onClick={handleProductEdit}  
          />
          <Button 
            inverted
            color="red"
            className="productCardDeleteBtn" 
            content="Delete" 
            onClick={handleDeleteClick}
          />
        </div> 
      </Grid.Row>
      {  editing ?  <EditControls handleProductEdit={handleProductEdit}/>: null }
    </React.Fragment>
    
  );
};

export default withRouter(ProductCard);