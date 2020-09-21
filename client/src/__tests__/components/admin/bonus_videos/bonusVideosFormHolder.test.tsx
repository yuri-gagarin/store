import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { shallow, mount, ReactWrapper, ShallowWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
// component imports //
import BonusVideoFormHolder from "../../../../components/admin_components/bonus_videos/forms/BonusVideosFormHolder";
import BonusVideoForm from "../../../../components/admin_components/bonus_videos/forms/BonusVideoForm";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, StateProvider, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockBonusVideos, setMockBonusVideoState } from "../../../../test_helpers/bonusVideoHelpers";
import BonusVideoPreview from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideoPreview";

describe("BonusVideoFormHolder Component tests", () => {
  let wrapper: ShallowWrapper; 
  // TEST default Form Holder state //
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = shallow(
        <BonusVideoFormHolder />
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    });
    it("Should not render'#bonusVideoFormDetails' for non-existing BonusVideo data", () => {
      expect(wrapper.find(".bonusVideoFormHolderYouTubeUrl").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderVimeoUrl").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderDescription").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderTimestamps").length).toEqual(0);
    });
    it("Should not render 'BonusVideoPreview' Component", () => {
      expect(wrapper.find(BonusVideoPreview).length).toEqual(0);
    });
  });
  // END default Form Holder State tests //
  // TEST default Form Holder state - Form OPEN - NO BonusVideo data//
  describe("Default Form Holder state - Form Open",  () => {
    let wrapper: ShallowWrapper;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = shallow(
        <BonusVideoFormHolder />
      );
      wrapper.find(Button).simulate("click");
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Form Should be open", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    });
    it("Should not render'#bonusVideoFormDetails' for non-existing BonusVideo data", () => {
      expect(wrapper.find(".bonusVideoFormHolderYouTubeUrl").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderVimeoUrl").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderDescription").length).toEqual(0);
      expect(wrapper.find(".bonusVideoFormHolderTimestamps").length).toEqual(0);
    });
    it("Should not render 'BonusVideoPreview' Component", () => {
      expect(wrapper.find(BonusVideoPreview).length).toEqual(0);
    });
    it("Should render a 'BonusVide0Form' Component", () => {
      expect(wrapper.find(BonusVideoForm).length).toEqual(1);
    });
  });
  // END default FormHolder state - Form OPEN - NO BonusVideo DATA //

  
  // TEST Form Holder state OPEN - WITH Current BonusVideo Data //
  describe("Form Holder state OPEN - WITH Current BonusVideo Data",  () => {
    let wrapper: ShallowWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockBonusVideoState({ currentBonusVideo: true });
      wrapper = shallow(
        <TestStateProvider mockState={state}>
          <BonusVideoFormHolder />
        </TestStateProvider>
      );
      wrapper.update()
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#productFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });/*
    it("Should have the Form rendered", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(1);
    });
    */
   it("Should render'#bonusVideoFormDetails'", () => {
    expect(wrapper.find(".bonusVideoFormHolderYouTubeUrl").length).toEqual(0);
    expect(wrapper.find(".bonusVideoFormHolderVimeoUrl").length).toEqual(0);
    expect(wrapper.find(".bonusVideoFormHolderDescription").length).toEqual(0);
    expect(wrapper.find(".bonusVideoFormHolderTimestamps").length).toEqual(0);
  });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminBonusVideoFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(BonusVideoImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(BonusVideoImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(BonusVideoImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  // END Form Holder state OPEN - WITH Current BonusVideo Data - NO IMAGES //
  // TEST Form Holder state OPEN - WITH Current BonusVideo Data - WITH IMAGES //
  
  // TEST Form Holder state OPEN - MOCK Submit action //
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={["/admin/products/create"]} >
          <TestStateProvider>
            <BonusVideoFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#productFormToggleBtn").at(0).simulate("click").update();
      const adminBonusVideoFormCreate = wrapper.find("#adminBonusVideoFormCreate").at(0);
      expect(adminBonusVideoFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateBonusVideoAction, show 'LoadingBar' Component", async () => {
      moxios.install();
      await act( async () => {
        moxios.stubRequest("/api/products/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newBonusVideo: createMockBonusVideos(1)[0]
          }
        });
        const adminBonusVideoFormCreate = wrapper.find("#adminBonusVideoFormCreate").at(0);
        adminBonusVideoFormCreate.simulate("click");
        //expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      // expect(sinon.spy(createBonusVideo)).toHaveBeenCalled()
      wrapper.update();
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'BonusVideoForm' Component after successful API call", () => {
      expect(wrapper.find(BonusVideoForm).length).toEqual(0);
    });
    // END Form Holder state OPEN - MOCK Submit action //
  });
  
});