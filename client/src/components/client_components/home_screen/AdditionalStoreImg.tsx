import React, { useState, useEffect } from "react";
import { Image } from "semantic-ui-react";
// css imports //
import "./css/homeStore.css";

interface StoreImgProps {
  showElement: boolean;
}
interface ImagesState {
  showFirst: boolean;
  showSecond: boolean;
  showThird: boolean;
  showFourth: boolean;
  showFifth: boolean;
};

const AddStoreImgs: React.FC<StoreImgProps> = ({ showElement }): JSX.Element => {
  const defaultState: ImagesState = {
    showFirst: false,
    showSecond: false,
    showThird: false,
    showFourth: false,
    showFifth: false
  }
  const [ imagesState, setImagesState ] = useState<ImagesState>(defaultState);

  const fadeInImages = () => {
    // maybe a shorter way to do this //
    setTimeout(() => {
      setImagesState((state) => ({ ...state, showFirst: true }));
    }, 500);
    setTimeout(() => {
      setImagesState((state) => ({ ...state, showSecond: true }));
    }, 1000); 
    setTimeout(() => {
      setImagesState((state) => ({ ...state, showThird: true }));
    }, 1500); 
    setTimeout(() => {
      setImagesState((state) => ({ ...state, showFourth: true }));
    }, 2000); 
    setTimeout(() => {
      setImagesState((state) => ({ ...state, showFifth: true }));
    }, 2500);
  };
  useEffect(() => {
    if (showElement) {
      fadeInImages();
    }
  }, [showElement]);
  return (
    <div>
      <div className={ imagesState.showFirst ? "homeStoreAddPhoto showAddPhoto" : "homeStoreAddPhoto"}>
        <Image src="/images/home_page/stock_store6.jpeg" size="small"/>
      </div>
      <div className={ imagesState.showSecond ? "homeStoreAddPhoto showAddPhoto" : "homeStoreAddPhoto"}>
        <Image src="/images/home_page/stock_store6.jpeg" size="small"/>
      </div>  
      <div className={ imagesState.showThird ? "homeStoreAddPhoto showAddPhoto" : "homeStoreAddPhoto"}>
        <Image src="/images/home_page/stock_store6.jpeg" size="small"/>
      </div>  
      <div className={ imagesState.showFourth ? "homeStoreAddPhoto showAddPhoto" : "homeStoreAddPhoto"}>
        <Image src="/images/home_page/stock_store6.jpeg" size="small"/>
      </div>
      <div className={ imagesState.showFifth ? "homeStoreAddPhoto showAddPhoto" : "homeStoreAddPhoto"}>
        <Image src="/images/home_page/stock_store6.jpeg" size="small"/>
      </div>
    </div>
  );
};

export default AddStoreImgs;