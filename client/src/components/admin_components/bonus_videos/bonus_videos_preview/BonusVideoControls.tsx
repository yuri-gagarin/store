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
      <div className="adminBonusVideosControlsTitle">BonusVideos Controls</div>
      <div className="adminBonusVideosControls">
        <div className="adminBonusVideosCounter">
          <div>Total BonusVideoss:</div>

          <div className="adminBonusVideossCount">{totalBonusVideos}</div>
        </div>
      </div>
    </div>
  );
};

export default BonusVideossControls;