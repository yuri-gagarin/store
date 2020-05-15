import React from "react";
// additional components //
import "./HomeHeader";
import HomeHeader from "./HomeHeader";
import HomeProducts from "./HomeProducts";
import HomeStore from "./HomeStore";
import FooterBar from "../navbars/FooterBar";
import Spacer from "../misc_components/Spacer";
// css imports //
import "./css/homeScreenComponent.css";
import LoginComponent from "../../admin_components/login/LoginComponent";

interface Props {
  title: string
}
const HomeScreenComponent: React.FC<Props> = (props): JSX.Element => {
  return (
    <React.Fragment>
        <HomeHeader />
        <HomeProducts />
        <div className="homeScreenParallax1"></div>
        <HomeStore />
        <LoginComponent />
        <Spacer height="50px" width="100%"/>
        <FooterBar />
    </React.Fragment>
  );
};

export default HomeScreenComponent;
