import React from "react";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
const options = [ "sports", "wood", "outdoors", "indoors", "tools"];
const stateOptions: DropdownItemProps[] = options.map((option) => {
  return {
    key: option,
    text: option.charAt(0).toUpperCase() + option.slice(1),
    value: option,
  };
});
const DropdownExampleMultipleSearchSelection = () => (
  <Dropdown
    placeholder='State'
    fluid
    multiple
    search
    selection
    options={stateOptions}
  />
)

export default DropdownExampleMultipleSearchSelection
