import React from "react";
import { Button, Embed, Item } from "semantic-ui-react";
// css //
import "./css/bonusVideoPreview.css";
// helpers //
import { ConvertDate, setDefaultImage, trimString } from "../../../helpers/displayHelpers";

interface Props {
  bonusVideo: IBonusVideoData;
}

const BonusVideoPreview: React.FC<Props> = ({ bonusVideo }): JSX.Element => {
  const { description, vimeoURL, youTubeURL, createdAt } = bonusVideo;

  if (youTubeURL) {
    return (
      <div className="youtubeBonusVideo">
        <Embed
          url={bonusVideo.youTubeURL}
        />
        <div className="bonusVideoDesc">
          {description}
        </div>
      </div>
    );
  } else if (vimeoURL) {
    return (
      <div>
        <Embed 
          url={bonusVideo.vimeoURL}
        />
        <div className="bonusVideoDesc">
          {description}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bonusVideoErrorDiv">
        <div className="bonusVideoErrorDivMsg">Can't Resolve Video Link</div>
      </div>
    )
  }
};

export default BonusVideoPreview;