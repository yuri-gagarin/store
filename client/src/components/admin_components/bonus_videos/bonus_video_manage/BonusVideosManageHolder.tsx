import React, { useEffect, useContext, useRef, useState } from "react";
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
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const newBonusVideosRef = useRef(loadedBonusVideos);
  // match route to conditionall render //
  const match = useRouteMatch("/admin/home/my_bonus_videos/manage");

  const handleBack = () => {
    history.goBack();
  };
  // lifycle hooks //
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllBonusVideos(dispatch)
        .then((_) => {
          setNewDataLoaded(true);
        })
        .catch((_) => {
          // handle an error ? //
          setNewDataLoaded(false);
        })
    }
    return () => { isMounted = false };
  }, [ dispatch ]); 
  
  useEffect(() => {
    if (newBonusVideosRef.current != loadedBonusVideos && !loading && !error) {
      setNewDataLoaded(true);
    }
  }, [ newBonusVideosRef.current, loadedBonusVideos, loading, error ]);
  // component render //
  return (
    newDataLoaded ?   
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
    :
    (
      error ? <ErrorScreen lastRequest={ () => getAllBonusVideos(dispatch) } /> : <LoadingScreen />
    )
  )
};
// export without router for tests //
export { BonusVideosManageHolder };
// default export //
export default withRouter(BonusVideosManageHolder);