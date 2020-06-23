import React from "react";
import { Button, Item } from "semantic-ui-react";
// css //
import "./css/servicePreview.css";
// helpers //
import { ConvertDate, setDefaultImage, trimString } from "../../../helpers/displayHelpers";

interface Props {
  service: IServiceData;
}

const ServicePreview: React.FC<Props> = ({ service }): JSX.Element => {
  const { name, description, price, images, createdAt } = service;

  return (
    <Item className="servicePreviewItem">
      <Item.Image size="small" src={setDefaultImage(images)}/>
      <Item.Content>
        <Item.Meta>
          Displayed name: <strong>{name}</strong>
        </Item.Meta>
        <Item.Meta>
          <span className='servicePrice'>Displayed Price: <strong>{price}</strong></span>
          <span className='serviceCreated'>Created At: <strong>{ConvertDate.international(createdAt)}</strong></span>
        </Item.Meta>
        <Item.Description>{trimString(description, 200)}</Item.Description>
        <Button basic color="green" content="View"></Button>
      </Item.Content>
    </Item>
  );
};

export default ServicePreview;