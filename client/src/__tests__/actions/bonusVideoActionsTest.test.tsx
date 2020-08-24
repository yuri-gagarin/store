import React from "react";
import faker from "faker";
// test dependences //
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
// component dependencies //
import BonusVideoView from "../../components/admin_components/bonus_videos/BonusVideosView";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext } from "../../state/Store";
import { StateProvider } from "../../state/Store";
// actions to test //
import { setCurrentBonusVideo, clearCurrentBonusVideo } from "../../components/admin_components/bonus_videos/actions/UIBonusVideoActions";
import { getAllBonusVideos, getBonusVideo, createBonusVideo, 
  editBonusVideo, deleteBonusVideo, 
} from "../../components/admin_components/bonus_videos/actions/APIBonusVideoActions";
// helpers and additional dependencies //
import { emptyBonusVideoData } from "../../state/reducers/bonusVideoReducer";
import { createMockBonusVideos, clearBonusVideoState } from "../../test_helpers/bonusVideoHelpers"
import { ClientBonusVideoData } from "../../components/admin_components/bonus_videos/actions/APIBonusVideoActions";
import { AxiosRequestConfig } from "axios";



type WrapperProps = {
  value: IGlobalAppContext;
}



const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("BonusVideo Actions Tests", () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    wrapper = shallow(
    <StateProvider>
      <BonusVideoView></BonusVideoView>
    </StateProvider>
    );
  });

  describe("Mock requests with no errors", () => {
    
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'SET_CURRENT_BONUS_VIDEO'", () => {
      let mockBonusVideos: IBonusVideoData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      
      beforeAll(() => {
        mockBonusVideos = createMockBonusVideos(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.bonusVideoState.error = null;
      });

      it("Should properly dispatch the action", () => {
        state.bonusVideoState.loadedBonusVideos = [ ...mockBonusVideos ];
        const bonusVideo = state.bonusVideoState.loadedBonusVideos[0];
        setCurrentBonusVideo(bonusVideo._id, dispatch, state);
      });
      it('Should return the correct new state', () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.currentBonusVideoData = mockBonusVideos[0];
        // retrieve new state //
        const { state : newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'CLEAR_CURRENT_BONUS_VIDEO'", () => {
      let mockBonusVideos: IBonusVideoData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      
      beforeAll(() => {
        mockBonusVideos = createMockBonusVideos(10);
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.bonusVideoState.currentBonusVideoData = mockBonusVideos[0];
      });

      it("Should properly dispatch the action", () => {
        clearCurrentBonusVideo(dispatch);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.currentBonusVideoData = emptyBonusVideoData();
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'GET_ALL_BONUS_VIDEOS'", () => {
      let mockBonusVideos: IBonusVideoData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockBonusVideos = createMockBonusVideos(10);
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              bonusVideos: mockBonusVideos
            }
          });
        });
        // mock action with moxios //
        getAllBonusVideos(dispatch)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/bonus_videos");
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.loadedBonusVideos = mockBonusVideos;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'GET_BONUS_VIDEO'", () => {
      let mockBonusVideo: IBonusVideoData; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockBonusVideo = createMockBonusVideos(1)[0];
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              bonusVideo: mockBonusVideo
            }
          });
        });
        // mock action with moxios //
        getBonusVideo(mockBonusVideo._id, dispatch)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/bonus_videos/" + mockBonusVideo._id);
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = mockBonusVideo;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'CREATE_BONUS_VIDEO'", () => {
      let createdBonusVideo: IBonusVideoData; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        createdBonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              newBonusVideo: createdBonusVideo
            }
          });
        });
        // mock store_item form data //
        let newBonusVideo: ClientBonusVideoData = {
          ...createdBonusVideo,
        };
        // mock action with moxios //
        createBonusVideo(newBonusVideo, dispatch)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/bonus_videos/create");
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct Store Item Data", () => {
        const sentData: ClientBonusVideoData = JSON.parse(requestConfig.data);
        const { youTubeURL, vimeoURL, description } = sentData;
        expect(youTubeURL).to.be.a("string");
        expect(vimeoURL).to.be.a("string");
        expect(description).to.be.a("string");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = createdBonusVideo;
        expectedBonusVideoState.loadedBonusVideos = [ ...expectedBonusVideoState.loadedBonusVideos, createdBonusVideo ]
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'EDIT_BONUS_VIDEO'", () => {
      let editedBonusVideo: IBonusVideoData; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        editedBonusVideo = { ...state.bonusVideoState.loadedBonusVideos[0] };
        editedBonusVideo.name = faker.lorem.word();
        editedBonusVideo.description = faker.lorem.paragraphs(1);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              editedBonusVideo: editedBonusVideo
            }
          });
        });
        // mock bonusVideo form data //
        let bonusVideoUpdate: ClientBonusVideoData = {
          ...editedBonusVideo,
        };
        // mock action with moxios //
        editBonusVideo(editedBonusVideo._id, bonusVideoUpdate, dispatch, state)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/bonus_videos/update/" + editedBonusVideo._id);
        expect(requestConfig.method).to.eq("patch");
      });
      it("Should send the correct Store Item Data", () => {
        const sentData: ClientBonusVideoData = JSON.parse(requestConfig.data);
        const { storeId, storeName, name, price, description, details, images, categories } = sentData;
        expect(storeId).to.be.a("string");
        expect(storeName).to.be.a("string");
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(details).to.be.a("string");
        expect(images).to.be.an("array");
        expect(categories).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = editedBonusVideo;
        expectedBonusVideoState.loadedBonusVideos = expectedBonusVideoState.loadedBonusVideos.map((bonusVideo) => {
          if (bonusVideo._id === editedBonusVideo._id) {
            return editedBonusVideo;
          } else {
            return bonusVideo;
          }
        })
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_BONUS_VIDEO'", () => {
      let deletedBonusVideo: IBonusVideoData; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedBonusVideo = { ...state.bonusVideoState.loadedBonusVideos[0] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              deletedBonusVideo: deletedBonusVideo
            }
          });
        });
        // mock action with moxios //
        deleteBonusVideo(deletedBonusVideo._id, dispatch, state)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/bonus_videos/delete/" + deletedBonusVideo._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = emptyBonusVideoData();
        expectedBonusVideoState.loadedBonusVideos = state.bonusVideoState.loadedBonusVideos.filter((bonusVideo) => bonusVideo._id !== deletedBonusVideo._id);
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'UPLOAD_BONUS_VIDEO_IMAGE'", () => {
      let createdImage: IBonusVideoImgData; let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let updatedBonusVideo: IBonusVideoData; let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.bonusVideoState.currentBonusVideoData = state.bonusVideoState.loadedBonusVideos[0];
        createdImage = createMockBonusVideoImage();
        // set mock updated store_item with mock image //
        updatedBonusVideo = { ...state.bonusVideoState.currentBonusVideoData };
        updatedBonusVideo.images.push(createdImage);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedBonusVideo: updatedBonusVideo
            }
          });
        });
        // mock action with moxios //
        const formData = new FormData();
        uploadBonusVideoImage(updatedBonusVideo._id, formData, state, dispatch) 
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_item_images/" + updatedBonusVideo._id);
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct request Data", () => {
        expect(requestConfig.data instanceof FormData).to.eq(true);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = updatedBonusVideo;
        expectedBonusVideoState.loadedBonusVideos = state.bonusVideoState.loadedBonusVideos.map((bonusVideo) => {
          if (bonusVideo._id === updatedBonusVideo._id) {
            return updatedBonusVideo;
          } else {
            return bonusVideo;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_BONUS_VIDEO_IMAGE'", () => {
      let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;
      let updatedBonusVideo: IBonusVideoData; let deletedImage: IBonusVideoImgData;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedImage = { ...state.bonusVideoState.currentBonusVideoData.images[0] }
        updatedBonusVideo = { ...state.bonusVideoState.currentBonusVideoData, images: [] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedBonusVideo: updatedBonusVideo
            }
          });
        });
        // mock action with moxios //
        deleteBonusVideoImage(deletedImage._id, state, dispatch) 
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_item_images/" + deletedImage._id + "/" + updatedBonusVideo._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should not send any additional data", () => {
        expect(requestConfig.data).to.eq(undefined);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = "All Ok";
        expectedBonusVideoState.currentBonusVideoData = updatedBonusVideo;
        expectedBonusVideoState.loadedBonusVideos = state.bonusVideoState.loadedBonusVideos.map((bonusVideo) => {
          if (bonusVideo._id === updatedBonusVideo._id) {
            return  {
              ...updatedBonusVideo,
              images: []
            };
          } else {
            return bonusVideo;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.equal(null);
      });
    });
  });

  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<BonusVideoAction>;

    beforeEach(() => {
      moxios.install();
      clearBonusVideoState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_BONUS_VIDEOS'", () => {
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getAllBonusVideos(dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_BONUS_VIDEO'", () => {
      let bonusVideo: IBonusVideoData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getBonusVideo(bonusVideo._id, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_BONUS_VIDEO'", () => {
      let bonusVideo: IBonusVideoData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        createBonusVideo(bonusVideo, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_BONUS_VIDEO'", () => {
      let bonusVideo: IBonusVideoData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        editBonusVideo(bonusVideo._id, bonusVideo, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_BONUS_VIDEO'", () => {
      let bonusVideo: IBonusVideoData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteBonusVideo(bonusVideo._id, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_BONUS_VIDEO_IMAGE'", () => {
      let bonusVideo: IBonusVideoData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideo = createMockBonusVideos(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        const mockImg = new FormData();
        uploadBonusVideoImage(bonusVideo._id, mockImg, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_BONUS_VIDEO_IMAGE'", () => {
      let bonusVideoImage: IBonusVideoImgData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        bonusVideoImage = createMockBonusVideoImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteBonusVideoImage(bonusVideoImage._id, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedBonusVideoState = { ...state.bonusVideoState };
        expectedBonusVideoState.responseMsg = error.message;
        expectedBonusVideoState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.bonusVideoState).to.eql(expectedBonusVideoState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.bonusVideoState.error).to.not.be.null;
      });
    });

  });
});