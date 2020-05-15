import React, { useState, useEffect } from "react";
import { Image, Icon } from "semantic-ui-react";
// css imports //
import "./css/storeServices.css";

interface Props {
  coverUrl?: string;
  pictureUrl?: string;
  description?: string;
};

const ServiceComponent: React.FC<Props> = ({ coverUrl, pictureUrl, description }): JSX.Element => {
  const [ covUrl, setCoverUrl ] = useState<string>("");
  const [ picUrl, setPicUrl ] = useState<string>("");

  const pullCoverUrl = (coverUrl: string | undefined) => {
    if (coverUrl) {
      setCoverUrl(coverUrl);
    } else {
      setCoverUrl("/images/services/service2.jpeg");
    }
  };
  const pullPicUrl = (pictureUrl: string | undefined) => {
    if (pictureUrl) {
      setPicUrl(pictureUrl);
    } else {
      setPicUrl("/images/services/service1.jpeg");
    }
  };
  // set image url or default image //
  useEffect(() => {
    pullPicUrl(coverUrl);
    pullCoverUrl(pictureUrl);
  }, [coverUrl, pictureUrl]);
  return (
    <div className="storeServiceHolder">
      <div className="storeServiceHiddenImg">
        <Image src={picUrl} size="medium"  />
      </div>
      <div className="storeServiceCoverImg" >
        <Image src={covUrl} size="medium" />
      </div>
      <Icon name="plus"></Icon>

    </div>

    
  );
};

export default ServiceComponent;