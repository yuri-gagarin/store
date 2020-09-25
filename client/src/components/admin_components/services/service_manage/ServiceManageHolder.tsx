import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import ServiceFormHolder from "../forms/ServiceFormHolder";
import ServiceCard from "./ServiceCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// actions and state //
import { getAllServices } from "../actions/APIServiceActions";
import { Store } from "../../../../state/Store";
// client routing //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
};

const ServiceManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedServices, error } = state.serviceState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const servicesRef = useRef(loadedServices);
  // routing //
  const match = useRouteMatch("/admin/home/my_services/manage");
  const handleBack = () => {
    history.goBack();
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllServices(dispatch)
        .then(_ => {
          setNewDataLoaded(true);
        })
        .catch(_ => {
          setNewDataLoaded(false);
        })
    }
    return () => { isMounted = false };
  }, [dispatch]); 

  useEffect(() => {
    if (servicesRef.current != loadedServices && !error && !loading) {
      setNewDataLoaded(true);
    }
  }, [ servicesRef.current, loadedServices, error, loading ])

  return (
    newDataLoaded ?
    <Grid padded stackable columns={2} id="serviceManageHolder">
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column computer={12} tablet={6} mobile={16}>
            <h3>Editing Service: { state.serviceState.currentServiceData.name }</h3>
            <Button inverted color="green" content="Back" onClick={handleBack}></Button>
          </Grid.Column>
        </Grid.Row>
        <ServiceFormHolder />
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
    : 
    (
      error ? <ErrorScreen lastRequest={ () => getAllServices(dispatch) }/> : <LoadingScreen />
    )
  );
};

// export without router for tests //
export { ServiceManageHolder };
//
export default withRouter(ServiceManageHolder);