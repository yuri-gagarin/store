import React from "react";
// additional components //
import "./HomeHeader";
import HomeHeader from "./HomeHeader";
import HomeProducts from "./HomeProducts";
import HomeStore from "./HomeStore";

interface Props {
  title: string
}
const HomeScreenComponent: React.FC<Props> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <HomeHeader />
      <HomeProducts />
      <HomeStore />
    </React.Fragment> 
  );
};

export default HomeScreenComponent;
