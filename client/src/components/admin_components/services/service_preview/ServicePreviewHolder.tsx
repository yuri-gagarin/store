import React, { useContext, useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// additional components //
import ServicePreview from "./ServicePreview";
import ServicesDetails from "./ServicesDetails";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
import PopularServiceHolder from "./popular_services/PopularServiceHolder";
// types and interfaces //
import { Store } from "../../../../state/Store";
// api actions //
import { getAllServices } from "../actions/APIServiceActions";

interface Props extends RouteComponentProps {
 
}

const ServicePreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedServices, error } = state.serviceState;

  // lifecycle hooks //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllServices(dispatch)
      .then((_) => {
        // handle success //
      })
      .catch((_) => {
        // handle possible error //
      });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);
  // render component //
  useEffect(() => {
    console.log(loading)
  }, [ loading ])
  return (
    loading ? 
    <LoadingScreen />
    :
    (
      error ? 
      <ErrorScreen lastRequest={() => getAllServices(dispatch) }/>
      :
      <Grid id="adminServicePreviewHolder" stackable padded columns={2}>
      <Grid.Row>
        <Grid.Column computer={10} tablet={8} mobile={16}>
          <Item.Group>
            {
              loadedServices.map((service) => {
                return (
                  <ServicePreview 
                    key={service._id}
                    service={service}
                  />
                );
              })
            }
          </Item.Group>
        </Grid.Column>
        <Grid.Column computer={6} tablet={8} mobile={16}>
          <ServicesDetails totalServices={loadedServices.length} />
          <PopularServiceHolder popularServices={loadedServices}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    )
    
  );
  
};
// export for testing without router //
export  { ServicePreviewHolder };
// default export //
export default withRouter(ServicePreviewHolder);