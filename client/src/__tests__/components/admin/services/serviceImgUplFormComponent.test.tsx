import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ServiceImgUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
import { Button } from "semantic-ui-react";
import MockFile from "../../../helpers/mockFile";
import moxios from "moxios";
import { createMockServices } from "../../../../test_helpers/serviceHelpers";
import { act } from 'react-dom/test-utils';

type InputProps = {
  type: string;
}
describe("Service Image Upload Form Tests", () => {

  describe("Render tests without any Image data", () => {
    let component: ShallowWrapper<React.FC>;
    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<ServiceImgUplForm />)
     });
    it("Should properly render", () => {
      expect(component).toMatchSnapshot();
    });
    it("Should have one upload Button element", () => {
      const uplButton = component.find(Button);
      expect(uplButton.length).toEqual(1);
    });
    it("Should have an input", () => {
      const input = component.find("input");
      expect(input.length).toEqual(1);
    });
  });

  describe("Render tests with an Image file present", () => {
    let component: ShallowWrapper<React.FC>;
    let input: ShallowWrapper;
    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<ServiceImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the ImgUpload button", () => {
      const imgUpoadBtn = component.find("#serviceImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the Cancel button", () => {
      const imgCanceldBtn = component.find("#serviceImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
  });
  describe("'#serviceImgUploadBtn' functionality", () => {
    let component: ShallowWrapper<React.FC>;
    let input: ShallowWrapper;

    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<ServiceImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully fire the 'uploadServiceImg' action", (done) => {
      moxios.install()
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            updatedService: createMockServices(1)[0]
          }
        })
      })
      const imgUpoadBtn = component.find("#serviceImgUploadBtn");
      imgUpoadBtn.simulate("click");
      setTimeout(() => {
        done()
      }, 500);
    });
    it("Should correctly render Select Image button after 'successful upload", () => {
      const selectImgBtn = component.find("#selectServiceImgBtn");
      expect(selectImgBtn.length).toEqual(1);
    });
    it("Should NOT render Image Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#serviceImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    })
    it("Should NOT render Cancel Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#serviceImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    })
  });
});