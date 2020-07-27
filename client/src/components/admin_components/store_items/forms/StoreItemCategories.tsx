import React from "react";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";

interface Props {
  _handleCategoryChange(categry: string): void;
}
const options = [ "sports", "wood", "outdoors", "indoors", "tools"];

const stateOptions: DropdownItemProps[] = options.map((option) => {
  return {
    key: option,
    text: option.charAt(0).toUpperCase() + option.slice(1),
    value: option,
  };
});

const StoreItemCategoriesSelection: React.FC<Props> = ({ _handleCategoryChange }) => {

  const handleCategoryChange = (e: React.SyntheticEvent) => {
    console.log(e.target)
  }
  return (
    <Dropdown
      placeholder='Categories'
      fluid
      multiple
      search
      selection
      options={stateOptions}
      onChange={handleCategoryChange}
    />
  )
}

export default StoreItemCategoriesSelection
