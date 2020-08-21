import React, { useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// css imports //
import "./css/bonusVideosPreviewHolder.css";
// additional components //
import BonusVideoPreview from "./BonusVideoPreview";
import BonusVideosControls from "./BonusVideoControls";
// types and interfaces //
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// api actions //
import { getAllBonusVideos } from "../actions/APIBonusVideoActions";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const BonusVideosPreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedBonusVideos } = state.bonusVideoState;
  useEffect(() => {
    getAllBonusVideos(dispatch);
  }, [dispatch]);

  return (
    <Grid stackable padded columns={2}>
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
  )
};

export default BonusVideosPreviewHolder;