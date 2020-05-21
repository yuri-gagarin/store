import React from "react";
import CreateStoreForm from "./CreateStoreForm";
import StoreImageUplForm from "./StoreImageUplForm";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";

const StoreView: React.FC<{}> = (props): JSX.Element => {
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu />
      <CreateStoreForm />
      <StoreImageUplForm />
    </div>
  )
};

export default StoreView;