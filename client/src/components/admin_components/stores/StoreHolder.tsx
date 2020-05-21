import React from "react";
import { Button, Card, Image } from "semantic-ui-react";

type Props = {
  imgUrl?: string;
  title?: string;
  description?: string;
  createdAt: string;
  editedAt: string;
}

const StoreCard: React.FC<Props> = ({ imgUrl, title, description, createdAt, editedAt }): JSX.Element => {
  const setStoreImg = (imgUrl: string | undefined): string => {
    return imgUrl ? imgUrl : "/images/logos/go_ed_log.jpg";
  }
  return (
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={setStoreImg(imgUrl)}
        />
        <Card.Header>{title}</Card.Header>
        <Card.Meta>Created: {createdAt}</Card.Meta>
        <Card.Meta>Edited: {editedAt}</Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Open
          </Button>
          <Button basic color='red'>
            Delete
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StoreCard;