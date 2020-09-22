import React, { useEffect, useContext  } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import BonusVideoFormHolder from "../forms/BonusVideosFormHolder";
import BonusVideoCard from "./BonusVideoCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// actions and state //
import { getAllBonusVideos } from "../actions/APIBonusVideoActions";
import { Store } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
};

const BonusVideosManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedBonusVideos , error } = state.bonusVideoState;
  // match route to conditionall render //
  const match = useRouteMatch("/admin/home/my_bonus_videos/manage");

  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    getAllBonusVideos(dispatch)
      .then((_) => {

      })
      .catch((_) => {
        // handle an error ? //
      })
  }, []); 
  useEffect(() => {
    console.log(loading)
  }, [ loading ])
  return (
    loading ? 
    <LoadingScreen />
    :
     ( error ? 
      <ErrorScreen lastRequest={ () => getAllBonusVideos(dispatch) } />
      :
      <Grid padded stackable columns={2}>
        <Route path={match?.url + "/edit"}> 
          <Grid.Row>
            <Grid.Column computer={12} tablet={6} mobile={16}>
              <h3>Editing Video: { state.bonusVideoState.currentBonusVideoData.description }</h3>
              <Button inverted color="green" content="Back" onClick={handleBack}></Button>
            </Grid.Column>
          </Grid.Row>
          <BonusVideoFormHolder />
        </Route>
        <Route exact path={match?.url}>
          <Grid.Row>
            <Grid.Column computer={12} tablet={8} mobile={16}>
            {
              loadedBonusVideos.map((bonusVideo) => {
                return (
                  <BonusVideoCard 
                    key={bonusVideo._id}
                    bonusVideo={bonusVideo}
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
     )
  );
};

export default withRouter(BonusVideosManageHolder);