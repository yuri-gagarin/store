import React from "react";
import { Grid } from "semantic-ui-react"
import { BrowserRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import BonusVideosPreviewHolder from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideosPreviewHolder";
import BonusVideoPreview from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideoPreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import BonusVideossControls from "../../../../components/admin_components/bonus_videos/bonus_videos_preview/BonusVideoControls";

describe("BonusVideoPreviewHolder Component render tests", () => {
  // TEST StprePreviewHolder in its loading state //
  describe("BonusVideoPreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      const mockState = generateCleanState();
      mockState.bonusVideoState.loading = true;
      wrapper = mount(
        <TestStateProvider mockState={mockState}>
          <Router keyLength={0} >
            <BonusVideosPreviewHolder />
          </Router>
        </TestStateProvider>
      );
    });
    it("Should correctly render", () => {
      const component = wrapper.find(BonusVideosPreviewHolder)
      expect(component).toMatchSnapshot();
    });
    it("Should have a LoadingScreen while 'loading == true'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the '#adminBonusVideoPreviewHolder'", () => {
      const adminBonusVideoPreview = wrapper.find(Grid);
      expect(adminBonusVideoPreview.length).toEqual(0);
    }); 
    it("Should not render any BonusVideoPreview Components", () => {
      const bonus_videoPreviewComponents = wrapper.find(BonusVideoPreview);
      expect(bonus_videoPreviewComponents.length).toEqual(0);
    });

  });
  // END TEST BonusVideoPreviewHolder in its loading state //
  // TEST BonusVideoPreviewHolder in its loaded state //
  describe("BonusVideoPreview in 'loaded' state", () => {
    let wrapper: ReactWrapper; const bonusVideos: IBonusVideoData[] = [];
    beforeAll( async () => {
      // mock data
      const vidData: IBonusVideoData = {
        _id: "1111",
        youTubeURL: "url",
        vimeoURL: "url",
        description: "description",
        createdAt: "now"
      };
      bonusVideos.push(vidData);
      // moxios and component mount //
      moxios.install();
      const mockState = generateCleanState();
      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <Router>
             <BonusVideosPreviewHolder />
           </Router>
         </TestStateProvider>
      );

      await act( async () => {
        await moxios.stubRequest("/api/bonus_videos", {
          status: 200,
          response: {
            responseMsg: "All ok",
            bonusVideos: bonusVideos
          }
        });
      });
      wrapper.update();
    });
    it("Should correctly render", () => {
      const comp = wrapper.find(BonusVideosPreviewHolder);
      expect(comp).toMatchSnapshot();
    });
    it("Should NOT have a LoadingScreen while 'loading == false'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should render the '#adminBonusVideoPreviewHolder'", () => {
      const adminBonusVideoPreview = wrapper.find(Grid);
      expect(adminBonusVideoPreview.length).toEqual(1);
    });
    it("Should render the 'BonusVideosControls' component", () => {
      const bonusVidControlsComp = wrapper.find(BonusVideossControls);
      expect(bonusVidControlsComp.length).toEqual(1);
    });
    it(`Should render a correct (${bonusVideos.length}) number of BonusVideoPreview Components`, () => {
      const bonus_videoPreviewComponents = wrapper.find(BonusVideoPreview);
      expect(bonus_videoPreviewComponents.length).toEqual(bonusVideos.length);
    });
  });
  // END TEST BonusVideoPreviewHolder in its loaded state //
});