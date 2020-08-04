import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import ServiceFormHolder from "../forms/ServiceFormHolder";
import ServiceCard from "./ServiceCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// actions and state //
import { getAllServices } from "../actions/APIServiceActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
};

const ServiceManageHolder: React.FC<Props> = ({ state, dispatch, history }): JSX.Element => {
  const { loadedServices } = state.serviceState;
  // local state //
  const [ pageLoaded, setPageLoaded ] = useState<boolean>(false);
  const match = useRouteMatch("/admin/home/my_services/manage");

  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    getAllServices(dispatch)
      .then((success) => {
        if (success) {
          setPageLoaded(true);
        }
      });
  }, []); 

  if (pageLoaded) {
    return (
      <Grid padded stackable columns={2}>
        <Route path={match?.url + "/edit"}> 
          <Grid.Row>
            <Grid.Column computer={12} tablet={6} mobile={16}>
              <h3>Editing Service: { state.serviceState.currentServiceData.name }</h3>
              <Button inverted color="green" content="Back" onClick={handleBack}></Button>
            </Grid.Column>
          </Grid.Row>
          <ServiceFormHolder state={state} dispatch={dispatch} />
        </Route>
        <Route exact path={match?.url}>
          <Grid.Row>
            <Grid.Column computer={12} tablet={8} mobile={16}>
            {
              loadedServices.map((service) => {
                return (
                  <ServiceCard 
                    key={service._id}
                    service={service}
                    imageCount={service.images.length}
                    state={state}
                    dispatch={dispatch}
                  />
                );
              })
            }
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} mobile={16}>
              
            </Grid.Column>
          </Grid.Row>
        </Route>
      </Grid>
    );
  } else {
    return (
      <LoadingScreen />
    );
  }
};

export default withRouter(ServiceManageHolder);