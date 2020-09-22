import React from "react";
import { Grid } from "semantic-ui-react";
import moxios from "moxios";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// routing //
import { MemoryRouter as Router } from "react-router-dom";
// components //
import BonusVideoManageHolder from "../../../../components/admin_components/bonus_videos/bonus_video_manage/BonusVideosManageHolder";
import BonusVideoCard from "../../../../components/admin_components/bonus_videos/bonus_video_manage/BonusVideoCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
// helpers and state //
import { StateProvider } from "../../../../state/Store";
import BonusVideosManageHolder from "../../../../components/admin_components/bonus_videos/bonus_video_manage/BonusVideosManageHolder";

describe("BonusVideo Manage Holder Tests", () => {
  /*
  describe("Default Component state at first render", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      moxios.install();

      component = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_bonus_videos/manage"]}>
          <StateProvider>
            <BonusVideoManageHolder />
          </StateProvider>
        </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/bonus_videos", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            bonusVideos: []
          }
        });
      });

    });
      afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should correctly render", () => {
      const manageHolder = component.find(BonusVideosManageHolder);
      expect(manageHolder).toMatchSnapshot();
    });
    it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1)
    });
  });
  
  // mock successful API call render tests //
  describe("State after a successful API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    const bonusVideos: IBonusVideoData[] = [];

    beforeAll( async () => {
      moxios.install();
      const vidData: IBonusVideoData = {
        _id: "1",
        youTubeURL: "url",
        vimeoURL: "url",
        description: "Something",
        createdAt: "1111"
      };
      bonusVideos.push(vidData);

      component = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_bonus_videos/manage"]}>
          <StateProvider>
            <BonusVideoManageHolder />
          </StateProvider>
        </Router>
      );
      
      await act( async () => {
        await moxios.stubRequest("/api/bonus_videos", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            bonusVideos: bonusVideos
          }
        });
      });
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial Loading Screen", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after the API call", async () => {
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should NOT render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(0);
    });
    it("Should render the correct BonusVideoManageHolder Component", () => {
      const bonusVideoManageHolderComp = component.find(BonusVideoManageHolder).find(Grid);
      expect(bonusVideoManageHolderComp.length).toEqual(1);
      expect(bonusVideoManageHolderComp).toMatchSnapshot();
    });
    it("Should render correct number of BonusVideoCard components", () => {
      const bonusVideoCards = component.find(BonusVideoCard);
      expect(bonusVideoCards.length).toEqual(bonusVideos.length);
    });
  });
  
  // END mock successfull API call render tests //
  // TEST mock ERROR API call render tests //
  */
  describe("State after a Error in API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    const bonusVideos: IBonusVideoData[] = [];

    beforeAll(async () => {
      await act(async () => {
        moxios.install();
        component = await mount(
          <Router keyLength={0} initialEntries={["/admin/home/my_bonus_videos/manage"]}>
            <StateProvider>
              <BonusVideoManageHolder />
            </StateProvider>
          </Router>
        );
        moxios.stubRequest("/api/bonus_videos", {
          status: 500,
          response: {
            responseMsg: "Error here",
            error: new Error("API Call Error")
          }
        });
      });
      moxios.uninstall();
    });
    
    it("Should correctly render the initial Loading Screen", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after an  API call", () => {
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(1);
    });
    it("Should NOT render the BonusVideoManageHolder Component", () => {
      const bonusVideoManageHolderComp = component.find(BonusVideoManageHolder).find(Grid);
      expect(bonusVideoManageHolderComp.length).toEqual(0);
    });
    it("Should NOT render ANY BonusVideoCard components", () => {
      const bonusVideoCards = component.find(BonusVideoCard);
      expect(bonusVideoCards.length).toEqual(0);
    });
    it("Should have a retry BonusVideo API call Button", () => {
      const retryButton = component.find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(2);
    });
    
    it("Should correctly re-dispatch the 'getBonusVideos' API request with the button click", async () => {
      const vidData: IBonusVideoData = {
        _id: "1",
        youTubeURL: "url",
        vimeoURL: "url",
        description: "Something",
        createdAt: "1111"
      };
      bonusVideos.push(vidData);
      await act( async () => {
        moxios.install();
        await moxios.stubRequest("/api/bonus_videos", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            bonusVideos: bonusVideos
          }
        });
        const retryButton = component.find("#errorScreenRetryButton");
        retryButton.at(0).simulate("click");  
      });
      // update component and assert correct rendering //
      component.update();
      const errorScreen = component.find(ErrorScreen);
      const bonusVideoManageHolderComp = component.find(BonusVideoManageHolder);
      expect(errorScreen.length).toEqual(0);
      expect(bonusVideoManageHolderComp.length).toEqual(1);
    });
    it("Should render correct number of 'BonusVideoCard' Components", () => {
      const bonusVideoCards = component.find(BonusVideoManageHolder).find(BonusVideoCard);
      expect(bonusVideoCards.length).toEqual(bonusVideos.length);
    });
    
  });
  
  // END mock successfull API call tests //
});