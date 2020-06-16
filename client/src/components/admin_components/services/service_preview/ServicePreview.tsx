import React from "react";
import { Item } from "semantic-ui-react";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

interface Props {
  service: IServiceData;
}

const ServicePreview: React.FC<Props> = ({ service }): JSX.Element => {
  const { name, description, price, images, createdAt } = service;
  const setDefaultImage = (): string => {
    const defaultImage = "https://react.semantic-ui.com/images/wireframe/image.png";
    return  (images[0] && images[0].url)  ? images[0].url : defaultImage;
  };

  return (
    <Item>
      <Item.Image  size="tiny" src={ setDefaultImage() }/>
      <Item.Content>
        <Item.Header>{name}</Item.Header>
        <Item.Meta>
          <span className='servicePrice'>Displayed Price: {price}</span>
          <span className='serviceCreated'>Created At: {ConvertDate.international(createdAt)}</span>
        </Item.Meta>
        <Item.Description>{description}</Item.Description>
      </Item.Content>
    </Item>
  )
};

export default ServicePreview;