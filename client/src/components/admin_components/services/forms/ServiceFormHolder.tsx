import React, { useState, useEffect, useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
// client routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/serviceFormHolder.css";
// additional components //
import ServiceForm from "./ServiceForm";
import ServiceImgPreviewHolder from "../image_preview/ServiceImgPreviewHolder";
import ServiceImgUplForm from "./ServiceImgUplForm";
import LoadingBar from "../../miscelaneous/LoadingBar";
// state //
import { Store } from "../../../../state/Store";
// api and ui actions //
import { createService, editService } from "../actions/APIServiceActions";
import { openServiceForm, closeServiceForm } from "../actions/UIServiceActions";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";
import { checkSetValues } from "../../../helpers/validationHelpers";
// types 
import { FormState } from "./ServiceForm";
interface Props extends RouteComponentProps {
  
}

type ServiceData = {
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[];
}

const ServiceFormHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, currentServiceData, serviceFormOpen, error } = state.serviceState;
  const { _id : serviceId, name, description, price, createdAt, editedAt } = currentServiceData;
  // local component state //
  const [ newForm, setNewForm ] = useState<boolean>(true);

  // ServiceForm toggle //
  const toggleServiceForm = () => {
    serviceFormOpen ? closeServiceForm(dispatch) : openServiceForm(dispatch);
  };
  // API handlers CREATE - EDIT //
  const handleCreateService = ({ name, price, description }: FormState): void => {
    const serviceData: ServiceData = {
      name,
      description,
      price,
      images: currentServiceData.images
    };

    createService(serviceData, dispatch)
      .then((_) => {
        // service created //
        closeServiceForm(dispatch);
      })
      .catch((_) => {
        // handle an error here possibly show details //
      });
  };
  const handleUpdateService = ({ name, description, price }: FormState): void => {
    const serviceParams: ServiceData = {
      name, description, price, images: currentServiceData.images
    };

    editService(currentServiceData._id, serviceParams, dispatch, state)
      .then((_) => {
        closeServiceForm(dispatch);
      })
      .catch((_) => {
        // handle an error , maybe show modal in thhe future //
      });
  };
  // lifecyle hooks //
  useEffect(() => {
    if (!serviceFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [ serviceFormOpen ]);
  // set correct data if a service is loaded //
  useEffect(() => {
      checkSetValues(currentServiceData) ? setNewForm(false) : setNewForm(true);
  }, [ currentServiceData ]);
  // component return //
  return (
    <div id="serviceFormHolder">
      { loading ? <LoadingBar /> : null }
      {
        !newForm ?
          <React.Fragment>
            <Grid.Row id="serviceFormHolderDetails">
              <Grid.Column mobile={16} tablet={14} computer={14}>
                <h1>Details</h1>
                <div className="serviceFormHolderDetailsName">
                  <h3>Service name:</h3>
                  <p>{name}</p>
                </div>
                <div className="serviceFormHolderDetailsPrice">
                  <h3>Service price:</h3>
                  <p>{price}</p>
                </div>
                <div className="serviceFormHolderDetailsDesc">
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
          <Button 
            id="serviceFormToggleBtn" 
            onClick={toggleServiceForm} 
            content={ !serviceFormOpen ? "Open Form" : "Close Form"}
          />
          {
            serviceFormOpen ? 
              <ServiceForm 
                name={name} 
                description={description} 
                price={price}
                newForm={newForm}
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

// export for testing withour router //
export { ServiceFormHolder };
// default export //
export default withRouter(ServiceFormHolder);

