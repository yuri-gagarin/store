import React, { useEffect  } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import BonusVideoFormHolder from "../forms/BonusVideosFormHolder";
import BonusVideoCard from "./BonusVideoCard";
// actions and state //
import { getAllBonusVideos } from "../actions/APIBonusVideoActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
};

const BonusVideosManageHolder: React.FC<Props> = ({ state, dispatch, history }): JSX.Element => {
  const { loadedBonusVideos } = state.bonusVideoState;
  const match = useRouteMatch("/admin/home/my_bonus_videos/manage");

  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    getAllBonusVideos(dispatch);
  }, []); 

  return (
    <Grid padded stackable columns={2}>
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column computer={12} tablet={6} mobile={16}>
            <h3>Editing Video: { state.bonusVideoState.currentBonusVideoData.description }</h3>
            <Button inverted color="green" content="Back" onClick={handleBack}></Button>
          </Grid.Column>
        </Grid.Row>
        <BonusVideoFormHolder state={state} dispatch={dispatch} />
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
  );
};

export default withRouter(BonusVideosManageHolder);