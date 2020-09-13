import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ServiceImgUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
import { Button } from "semantic-ui-react";

describe("Service Image Upload Form Tests", () => {
  let component: ShallowWrapper<React.FC>;

  beforeAll(() => {
   component = shallow<typeof ServiceImgUplForm>(<ServiceImgUplForm />)
  });

  describe("Render tests without any Image data", () => {
    it("Should properly render", () => {
      expect(component).toMatchSnapshot();
    });
    it("Should have one upload Button element", () => {
      const uplButton = component.find(Button);
      expect(uplButton.length).toEqual(1);
    });
  });

  describe("Render tests with an Image file present", () => {
    beforeAll(() => {
    });
    it("Should have an input", () => {
      const input = component.find("input");
      // const file: File = jest.fn<File, []>()
      console.log(input.html())
    })
  })
});