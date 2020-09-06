/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import axios from "axios";
import fetchMock from "jest-fetch-mock";
import ReactSixteenAdapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new ReactSixteenAdapter() });
axios.defaults.baseURL = "127.0.0.1:8080"
fetchMock.enableMocks();
