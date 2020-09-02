import React, { useState, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
// css imports //
import "./css/serviceFormHolder.css";
// additional components //
import ServiceForm from "./ServiceForm";
import ServiceImgPreviewHolder from "../image_preview/ServiceImgPreviewHolder";
import ServiceImgUplForm from "./ServiceImgUplForm";
// state //
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// api actions //
import { createService, editService } from "../actions/APIServiceActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
// types 
import { FormState } from "./ServiceForm";
interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

type ServiceData = {
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[];
}

const ServiceFormHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ formOpen, setFormOpen ] = useState<boolean>(false);
  const [ imgUpload, setImgUpload ] = useState<boolean>(false);
  const [ newForm, setNewForm ] = useState<boolean>(true);

  const { currentServiceData } = state.serviceState;
  const { _id : serviceId, name, description, price, createdAt, editedAt } = currentServiceData;

  const handleCreateService = ({ name, price, description }: FormState): void => {
    const serviceData: ServiceData = {
      name,
      description,
      price,
      images: currentServiceData.images
    };

    createService(serviceData, dispatch)
      .then((success) => {
        if (success) {
          // service created //
          setImgUpload(true);
        } else {
          console.error("error");
        }
      });
  };

  const handleUpdateService = ({ name, description, price }: FormState): void => {
    const serviceParams: ServiceData = {
      name, description, price, images: currentServiceData.images
    };

    editService(currentServiceData._id, serviceParams, dispatch, state)
      .then((success) => {
        if (success) {
          setFormOpen(false);
        }
      })
  }

  const handleFormOpen = () => {
    setFormOpen(!formOpen);
  };
  
  useEffect(() => {
    if (!formOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formOpen])
  // set correct data if a service is loaded //
  useEffect(() => {
    if (serviceId) {
      setNewForm(false);
      setFormOpen(true);
    }
  }, [serviceId]);


  return (
    <div id="serviceFormHolder">
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="serviceFormHolderDetails">
                  <h3>Service name:</h3>
                  <p>{name}</p>
                </div>
                <div className="serviceFormHolderPrice">
                  <h3>Service price:</h3>
                  <p>{price}</p>
                </div>
                <div className="serviceFormHolderDetails">
                  <h3>Service description:</h3>
                  <p>{description}</p>
                </div>
                <div className="serviceFormHolderTimestamps">
                  <span>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
                  <span>Edited At: <strong>{ConvertDate.international(editedAt)}</strong></span>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <ServiceImgPreviewHolder state={state} dispatch={dispatch} />
              </Grid.Column>
            </Grid.Row>
            <ServiceImgUplForm />
          </React.Fragment>
          : null
      }
      <Grid.Row>
        <Grid.Column mobile={16} tablet={15} computer={14}>
          <Button  id="serviceFormToggleBtn" onClick={handleFormOpen} content={ !formOpen ? "Open Form" : "Close Form"}></Button>
          {
            formOpen ? <ServiceForm 
                        name={name} 
                        description={description} 
                        price={price}
                        handleCreateService={handleCreateService}
                        handleUpdateService={handleUpdateService}
                      /> 
                      : null
          }
         
        </Grid.Column>
      </Grid.Row>
    </div>
  );
};

export default ServiceFormHolder;

