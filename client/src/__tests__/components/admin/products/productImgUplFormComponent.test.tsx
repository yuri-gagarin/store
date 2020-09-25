import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import ProductImgUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
// React.Context and State //
import { StateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockProducts } from "../../../../test_helpers/productHelpers";

describe("Product Image Upload Form Tests", () => {

  describe("Render tests without any Image data", () => {
    let component: ShallowWrapper;

    beforeAll(() => {
      component = shallow(<ProductImgUplForm />)
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
    let component: ShallowWrapper;
    let input: ShallowWrapper;

    beforeAll(() => {
      component = shallow(<ProductImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the ImgUpload button", () => {
      const imgUpoadBtn = component.find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the Cancel button", () => {
      const imgCanceldBtn = component.find("#productImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
    it("Should properly handle the '#productImgCancelBtn' and render correct local state", () => {
      const imgCancelBtn = component.find("#productImgCancelBtn");
      imgCancelBtn.simulate("click");
      expect(component.find("#productImgCancelBtn").length).toEqual(0);
      expect(component.find("#productImgUploadBtn").length).toEqual(0);
      expect(component.find("#selectProductImgBtn").length).toEqual(1);
    });
  });
  // MOCK Successful Image upload tests //
  describe("'#productImgUploadBtn' functionality and successful upload and local state changes", () => {
    let component: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount(
        <StateProvider>
          <ProductImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully fire the 'uploadProductImg' action and show loader", async () => {
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            updatedProduct: createMockProducts(1)[0]
          }
        });
      });

      const imgUpoadBtn = component.find("#productImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // loader should be displayed on th #productImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      // update component and local state //
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        });
      });
    });
    it("Should correctly render Select Image button after 'successful upload", () => {
      const selectImgBtn = component.find(ProductImgUplForm).render().find("#selectProductImgBtn");
      expect(selectImgBtn.length).toEqual(1);
    });
    it("Should NOT render Image Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render Cancel Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  describe("'#cancelProductImgUploadBtn' functionality and a failed upload", () => {
    let component: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount(
        <StateProvider>
          <ProductImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the 'uploadProductImg' action error", async () => {
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {
            responseMsg: "Error",
            error: new Error("Oops")
          }
        });
      });

      const imgUpoadBtn = component.find("#productImgUploadBtn").at(0);
      imgUpoadBtn.simulate("click");
      // loader should be displayed on th #productImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      // update component and local state //
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        });
      });
    });
    it("Should NOT render Select Image button after a 'failed' upload", () => {
      const selectImgBtn = component.find(ProductImgUplForm).render().find("#selectProductImgBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    it("Should render Image Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    })
    it("Should render Cancel Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
  });
  // END Mock unsuccessful Image upload tests //
});