import React from "react";
import { } from "semantic-ui-react";
// css imports //
import "./css/bonusVideoControls.css";
// additional components //

interface Props {
  totalBonusVideos: number;
}
const BonusVideossControls: React.FC<Props> = ({ totalBonusVideos }): JSX.Element => {

  return (
    <div className="adminBonusVideosControlsHolder">
      <div className="adminBonusVideosControlsTitle">My Videos Controls</div>
      <div className="adminBonusVideosControls">
        <div className="adminBonusVideosCounter">
          <div>Total Linked Videos:</div>
          <div className="adminBonusVideosCount">{totalBonusVideos}</div>
        </div>
      </div>
    </div>
  );
};

export default BonusVideossControls;