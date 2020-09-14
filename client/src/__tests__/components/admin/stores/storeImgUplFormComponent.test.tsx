import React from "react";
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import StoreImgUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import { Button, ButtonProps } from "semantic-ui-react";
import MockFile from "../../../helpers/mockFile";
import moxios from "moxios";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
import { act } from 'react-dom/test-utils';
import { StateProvider } from "../../../../state/Store";
type InputProps = {
  type: string;
}
describe("Store Image Upload Form Tests", () => {

  describe("Render tests without any Image data", () => {
    let component: ShallowWrapper<React.FC>;
    beforeAll(() => {
      component = shallow<React.FC<{}>, {}>(<StoreImgUplForm />)
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
      component = shallow<React.FC<{}>, {}>(<StoreImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the ImgUpload button", () => {
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the Cancel button", () => {
      const imgCanceldBtn = component.find("#storeImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
  });

  describe("'#StoreImgUploadBtn' functionality and successful upload and local state changes", () => {
    let component: ReactWrapper<typeof StoreImgUplForm, {}, {}>;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount<React.FC<{}>, {}>
      (
        <StateProvider>
          <StoreImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully fire the 'uploadStoreImg' action and show loader", async () => {
      moxios.install()
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            updatedStore: createMockStores(1)[0]
          }
        })
      })
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // loader should be displayed on the #storeImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);

      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        })
      })
      
      
    });
    it("Should correctly render Select Image button after 'successful upload", () => {
      const selectImgBtn = component.find("#selectStoreImgBtn");
      expect(selectImgBtn.length).toEqual(2);
    });
    it("Should NOT render Image Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    })
    it("Should NOT render Cancel Upload button after 'successful upload", () => {
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    })
  });
  
  describe("'#cancelStoreImgUploadBtn' functionality and a failed upload", () => {
    let component: ReactWrapper<React.FC>;
    let input: ReactWrapper;

    beforeAll(() => {
      component = mount<React.FC<{}>, {}>(
        <StateProvider>
          <StoreImgUplForm />
        </StateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the 'uploadStoreImg' action error", async () => {
      moxios.install()
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {
            responseMsg: "Error",
            error: new Error("Oops")
          }
        });
      })
      const imgUpoadBtn = component.find("#storeImgUploadBtn").at(0);
      imgUpoadBtn.simulate("click");
      // loader should be displayed on the #storeImgUploadBtn //
      const imgUpoadBtnLoading = component.find(Button);
      expect(imgUpoadBtnLoading.at(1).props().loading).toEqual(true);
      
      await act( async () => {
        return new Promise((res, _) => {
          setTimeout(() => {
            component.update();
            res();
          }, 500);
        })
      });
      
    });
    it("Should NOT render Select Image button after a 'failed' upload", () => {
      const selectImgBtn = component.find("#selectStoreImgBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    it("Should render Image Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    })
    it("Should render Cancel Upload button after a 'failed' upload", () => {
      const imgUpoadBtn = component.find("#storeImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(2);
    })
  });
});