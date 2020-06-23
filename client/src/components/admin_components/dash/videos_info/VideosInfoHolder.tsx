import React from "react";
// css imports //
import './css/videosInfoHolder.css';
// state and actions //
import { AppAction, IGlobalAppState } from "../../../../state/Store";

interface Props {
  total?: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
const VideosInfoHolder: React.FC<Props> = ({ total }): JSX.Element => {
  const numOfvideos = 10;
  return (
    <div id="videosInfoHolder">
      <div className="videosCounter">
        Videos
      </div>
      <div className="videosTitle">
        {numOfvideos}
      </div>
    </div>
  );
};  

export default VideosInfoHolder;