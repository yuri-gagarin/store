import React, { useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// additional components //
import ServicePreview from "./ServicePreview";
import ServicesDetails from "./ServicesDetails"
// types and interfaces //
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// api actions //
import { getAllServices } from "../actions/APIServiceActions";
import PopularServiceHolder from "./popular_services/PopularServiceHolder";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const ServicePreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedServices } = state.serviceState;
  console.log(loadedServices);
  useEffect(() => {
    getAllServices(dispatch);
  }, []);

  return (
    <Grid stackable columns={2}>
      <Grid.Row>
      <Grid.Column computer={10} mobile={16}>
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
      <Grid.Column computer={6} mobile={16}>
        <ServicesDetails totalServices={loadedServices.length} />
        <PopularServiceHolder popularServices={loadedServices}/>
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
  )
};

export default ServicePreviewHolder;