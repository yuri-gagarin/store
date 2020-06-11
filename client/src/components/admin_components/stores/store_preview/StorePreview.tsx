import React, { useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
// dependencies //
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
// types //
interface Props {
  _id?: string;
  title: string;
  description: string;
  images: IStoreImgData[];
};

const StorePreview: React.FC<Props> = ({ title, description, images }): JSX.Element => {
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
      <h3>{title}</h3>
      <div>{description}</div>
      <ImageGallery items={items}/>
    </Segment>

  );
};

export default StorePreview;