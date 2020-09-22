import React from "react"
// testing utils
import { mount, ReactWrapper, ShallowWrapper } from "enzyme";
// component imports //
import BonusVideoFormHolder from "../../../../components/admin_components/bonus_videos/forms/BonusVideosFormHolder";
import BonusVideoForm from "../../../../components/admin_components/bonus_videos/forms/BonusVideoForm";
import BonusVideoPreview from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideoPreview";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider, IGlobalAppContext } from "../../../../state/Store";
// helpers //
import { setMockBonusVideoState } from "../../../../test_helpers/bonusVideoHelpers";

describe("BonusVideoFormHolder Component tests", () => {
  // TEST default Form Holder state //
  describe("Default Form Holder state",  () => {
    let wrapper: ReactWrapper; 

    beforeAll(() => {
      window.scrollTo = jest.fn;
      wrapper = mount(
        <TestStateProvider>
          <BonusVideoFormHolder />
        </TestStateProvider>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(BonusVideoFormHolder)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find("#bonusVideoFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render'#bonusVideoFormDetails' for non-existing BonusVideo data", () => {
      expect(wrapper.find("#bonusVideoFormDetails").length).toEqual(0);
    });
    it("Should NOT render 'BonusVideoPreview' Component", () => {
      expect(wrapper.find(BonusVideoPreview).length).toEqual(0);
    });
  });
  // END default Form Holder State tests //
  // TEST default Form Holder state - Form OPEN - NO BonusVideo data//
  describe("Default Form Holder state - Form Open",  () => {
    let wrapper: ReactWrapper;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <TestStateProvider>
          <BonusVideoFormHolder />
        </TestStateProvider>
      );
      wrapper.find(BonusVideoFormHolder).find("#bonusVideoFormToggleBtn").at(0).simulate("click");
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(BonusVideoFormHolder)).toMatchSnapshot();
    });
    it("Form Should be open", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(1);
    });
    
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(BonusVideoFormHolder).render().find("#bonusVideoFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render'#bonusVideoFormDetails' for non-existing BonusVideo data", () => {
      const formDetails = wrapper.find(BonusVideoFormHolder).render().find("#bonusVideoFormDetails");
      expect(formDetails.length).toEqual(0);
    });
  
    it("Should NOT render 'BonusVideoPreview' Component", () => {
      const bonusVideoPreview = wrapper.find(BonusVideoPreview);
      expect(bonusVideoPreview.length).toEqual(0);
    });
    it("Should render a 'BonusVide0Form' Component", () => {
      expect(wrapper.find(BonusVideoForm).length).toEqual(1);
    });
  });
  // END default FormHolder state - Form OPEN - NO BonusVideo DATA //
  // TEST Form Holder state OPEN - WITH Current BonusVideo Data //
  describe("Form Holder state OPEN - WITH Current BonusVideo Data",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockBonusVideoState({ currentBonusVideo: true });
      wrapper = mount(
        <TestStateProvider mockState={state}>
          <BonusVideoFormHolder />
        </TestStateProvider>
      );
      wrapper.find(BonusVideoFormHolder).find("#bonusVideoFormToggleBtn").at(0).simulate("click");
    });

    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#bonusVideoFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render 'BonusVideoPreview' Component", () => {
      const bonusVideoPreview = wrapper.find(BonusVideoPreview);
      expect(bonusVideoPreview.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(BonusVideoForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.find(BonusVideoFormHolder).render().find("#bonusVideoFormUpdate");
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render'#bonusVideoFormDetails'", () => {
      const bonusVideFormDetails = wrapper.find(BonusVideoFormHolder).render().find("#bonusVideoFormDetails");
      expect(bonusVideFormDetails.length).toEqual(1);
    });
    it("Should correctly render '.bonusVideoFormHolderYouTubeUrl'", () => {
      const videoDetail = wrapper.find(BonusVideoFormHolder).render().find(".bonusVideoFormHolderYouTubeUrl");
      expect(videoDetail.length).toEqual(1);
    });
    it("Should correctly render '.bonusVideoFormHolderVimeoUrl'", () => {
      const videoDetail = wrapper.find(BonusVideoFormHolder).render().find(".bonusVideoFormHolderVimeoUrl");
      expect(videoDetail.length).toEqual(1);
    });
    it("Should correctly render '.bonusVideoFormHolderDescription'", () => {
      const videoDetail = wrapper.find(BonusVideoFormHolder).render().find(".bonusVideoFormHolderDescription");
      expect(videoDetail.length).toEqual(1);
    });
    it("Should correctly render '.bonusVideoFormHolderTimestamps'", () => {
      const videoDetail = wrapper.find(BonusVideoFormHolder).render().find(".bonusVideoFormHolderTimestamps");
      expect(videoDetail.length).toEqual(1);
    });
  });
  // END Form Holder state OPEN - WITH Current BonusVideo Data //
});