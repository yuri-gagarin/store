import React, { useContext, useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/bonusVideosPreviewHolder.css";
// additional components //
import BonusVideoPreview from "./BonusVideoPreview";
import BonusVideosControls from "./BonusVideoControls";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// types and interfaces //
import { Store} from "../../../../state/Store";
// api actions //
import { getAllBonusVideos } from "../actions/APIBonusVideoActions";

interface Props extends RouteComponentProps {
  
}

const BonusVideosPreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedBonusVideos } = state.bonusVideoState;

  // lifecycle hooks //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllBonusVideos(dispatch)
        .then((_) => {
          // handle success //
        })
        .catch((_) => {
          // handle error //
        });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);

  // compnent return //
  return (
    loading ? 
    <LoadingScreen />
    :
    <Grid 
      id={"adminBonusVideosPreviewHolder"}
      stackable 
      padded 
      columns={2}
    >
      <Grid.Row>
      <Grid.Column computer={10} tablet={8} mobile={16}>
        <Item.Group>
          {
            loadedBonusVideos.map((video) => {
              return (
                <BonusVideoPreview 
                  key={video._id}
                  bonusVideo={video}
                />
              );
            })
          }
        </Item.Group>
      </Grid.Column>
      <Grid.Column computer={6} tablet={8} mobile={16}>
        <BonusVideosControls totalBonusVideos={loadedBonusVideos.length} />
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
  );
};
// test export without the router //
export { BonusVideosPreviewHolder };
// default export //
export default withRouter(BonusVideosPreviewHolder);