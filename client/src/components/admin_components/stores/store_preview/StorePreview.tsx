import React, { useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
// dependencies //
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
// styles //
import "./css/storePreview.css";
// helpers //
import { ConvertDate } from "../../../helpers/displayHelpers";

// types //
interface Props {
  _id?: string;
  title: string;
  description: string;
  images: IStoreImgData[];
  createdAt: string;
  editedAt?: string;
};

const StorePreview: React.FC<Props> = ({ title, description, images, createdAt, editedAt }): JSX.Element => {
  const [ items, setItems ] = useState<ReactImageGalleryItem[]>([]);
  useEffect(() => {
    const galleryItems: ReactImageGalleryItem[] = images.map((image) => {
      return {
        original: image.url,
        thumbnail: image.url,
        originalAlt: "Image",
        thumbnailAlt: "Thumb"
      };
    });
    setItems(galleryItems);
  }, []);

  return (
    <Segment>
      <h3 className="adminStoreTitle">{title}</h3>
      <div className="adminStoreDescription">{description}</div>
      <ul className="adminStoreDetails">
        <li>Created At: {ConvertDate.international(createdAt)}</li>
        <li>Edited At: {ConvertDate.international(editedAt)}</li>
      </ul>
      <div className="adminStoreImageDetails">
        <h5>Displayed Images: </h5>
      </div>
      <ImageGallery items={items}/>
    </Segment>

  );
};

export default StorePreview;