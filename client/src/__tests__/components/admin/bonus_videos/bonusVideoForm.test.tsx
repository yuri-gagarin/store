import React from "react";
import BonusVideoForm from "../../../../components/admin_components/bonus_videos/forms/BonusVideoForm";
import { mount, ReactWrapper } from "enzyme";
// helpers //

describe("BonusVideo Form Component render tests", () => {
  describe("Empty Form render tests", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock data //
      const bonusVideoData: IBonusVideoData = {
        _id: "",
        youTubeURL: "",
        vimeoURL: "",
        description: "",
        createdAt: ""
      }
      // mount form //
      wrapper = mount(
        <BonusVideoForm  
          bonusVideoData={bonusVideoData} 
          handleCreateBonusVideo={jest.fn}
          handleUpdateBonusVideo={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#bonusVideoYoutubeInput'", () => {
      expect(wrapper.render().find("#bonusVideoYoutubeInput").length).toEqual(1);
    });
    it("Should render '#bonusVideoVimeoInput'", () => {
      expect(wrapper.render().find("#bonusVideoVimeoInput").length).toEqual(1);
    });
    it("Should render '#bonusVideoDescInput'", () => {
      expect(wrapper.render().find("#bonusVideoDescInput").length).toEqual(1);
    });
    it("Should render '#bonusVideoFormCreate' Button", () => {
      expect(wrapper.render().find("#bonusVideoFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#bonusVideoFormUpdate' Button'", () => {
      expect(wrapper.render().find("#bonusVideoFormUpdate").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IBonusVideoData;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock video data //
      mockData = {
        _id: "1111",
        youTubeURL: "url",
        vimeoURL: "url",
        description: "desc",
        createdAt: "now"
      };

      wrapper = mount(
        <BonusVideoForm 
          bonusVideoData={mockData}
          handleCreateBonusVideo={jest.fn}
          handleUpdateBonusVideo={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#bonusVideoYoutubeInput'", () => {
      expect(wrapper.render().find("#bonusVideoYoutubeInput").length).toEqual(1);
    });
    it("Should set correct data in '#bonusVideoYoutubeInput'", () => {
      const input = wrapper.render().find("#bonusVideoYoutubeInput");
      expect(input.val()).toEqual(mockData.youTubeURL);
    });
    it("Should render '#bonusVideoVimeoInput'", () => {
      expect(wrapper.render().find("#bonusVideoVimeoInput").length).toEqual(1);
    });
    it("Should set correct data in '#bonusVideoVimeoInput'", () => {
      const input = wrapper.render().find("#bonusVideoVimeoInput");
      expect(input.val()).toEqual(mockData.vimeoURL);
    });
    it("Should render '#bonusVideoDescInput'", () => {
      expect(wrapper.render().find("#bonusVideoDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#bonusVideoDescInput'", () => {
      const input = wrapper.render().find("#bonusVideoDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should NOT render '#bonusVideoFormCreate' Button", () => {
      expect(wrapper.render().find("#bonusVideoFormCreate").length).toEqual(0);
    });
    it("Should NOT render '#bonusVideoFormUpdate' Button'", () => {
      expect(wrapper.render().find("#bonusVideoFormUpdate").length).toEqual(1);
    });
  });
})