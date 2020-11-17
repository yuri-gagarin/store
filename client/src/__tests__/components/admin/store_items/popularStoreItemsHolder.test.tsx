import React from "react";
import PopularStoreItemsHolder from "../../../../components/admin_components/store_items/store_items_preview/popular_store_items/PopularStoreItemsHolder";
// test dependencies //
import { mount, ReactWrapper } from "enzyme";
import PopularStoreItem from "../../../../components/admin_components/store_items/store_items_preview/popular_store_items/PopularStoreItem";

describe("'PopularStoreItemsHolder' component render tests", () => {
  let mockStore: IStoreData; let mockStoreItems: IStoreItemData[];
  const date = new Date("1/1/2019").toString();
  let wrapper: ReactWrapper;

  beforeAll(() => {
    mockStore = {
      _id: "1",
      title: "title",
      description: "description",
      images: [],
      createdAt: date
    };
    mockStoreItems = [
      {
        _id: "111",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        categories: [ "sports", "outdoors" ],
        images: [],
        createdAt: date
      },
      {
        _id: "112",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        categories: [ "sports" ],
        images: [],
        createdAt: date
      },
      {
        _id: "113",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        categories: [ "sports", "outdoors", "education" ],
        images: [],
        createdAt: date
      }
    ];

    wrapper = mount(
      <PopularStoreItemsHolder popularStoreItems={mockStoreItems} />
    );
  });

  describe("Rendering in its default state", () => {
    it("Should correctly render and match snapshot", () => {
      expect(wrapper.find(PopularStoreItemsHolder)).toMatchSnapshot();
    });
    it("Should render a correct number of 'PopularStoreItem' components", () => {
      const popularStoreItems = wrapper.find(PopularStoreItem);
      expect(popularStoreItems.length).toEqual(mockStoreItems.length);
    });
  });

});