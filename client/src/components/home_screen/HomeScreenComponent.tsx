import React from "react";
// additional components //
import "./HomeHeader";
import HomeHeader from "./HomeHeader";
import HomeProducts from "./HomeProducts";
import HomeStore from "./HomeStore";
// css imports //
import "./css/homeScreenComponent.css";

interface Props {
  title: string
}
const HomeScreenComponent: React.FC<Props> = (props): JSX.Element => {
  return (
    <React.Fragment>
        <HomeHeader />
        <div className="homeScreenParallax1"></div>
        <HomeProducts />
        <HomeStore />
    </React.Fragment>
  );
};

export default HomeScreenComponent;
