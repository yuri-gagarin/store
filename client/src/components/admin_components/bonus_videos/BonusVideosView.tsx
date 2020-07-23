import React, { useContext } from "react";
import BonusVideosFormHolder from "./forms/BonusVideosFormHolder"
// css imports //
import "./css/adminBonusVideoView.css";
import AdminBonusVideoMenu from "../menus/AdminBonusVideoMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import BonusVideosPreviewHolder from "./bonus_videos_preview/BonusVideosPreviewHolder";
import BonusVideosManageHolder from "./bonus_video_manage/BonusVideosManageHolder";
import Spacer from "../miscelaneous/Spacer";
// state //
import { Store } from "../../../state/Store";

const BonusVideosGeneralView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  return (
    <div id="adminBonusVideoViewHolder">
      <AdminBonusVideoMenu  dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/my_bonus_videos/all">
          <Spacer width="100%" height="100px" />
          <BonusVideosPreviewHolder state={state} dispatch={dispatch} />
          <h3>Store view</h3>
        </Route>
        <Route path="/admin/home/my_bonus_videos/create">
          <Spacer width="100%" height="100px"/>
          <BonusVideosFormHolder state={state} dispatch={dispatch} />
        </Route>
        <Route path="/admin/home/my_stores/manage">
          <Spacer width="100%" height="100px" />
          <BonusVideosManageHolder state={state} dispatch={dispatch} />
        </Route>
      </Switch>
     
    </div>
  )
};

export default BonusVideosGeneralView;