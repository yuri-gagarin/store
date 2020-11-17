import MockFile from "../helpers/mockFile";

describe("MockFile function unit tets", () => {
  it("Should create a new mock file for testing", () => {
    const file = MockFile.create("hello", 10, { type: "plain/txt"});
    expect(file instanceof File).toEqual(true);
  });
  it("Should assign a correct name to file", () => {
    const name = "file_name"
    const file = MockFile.create(name, 10, { type: "plain/txt"});
    const expectedFilename = file.name.split(".")[0];
    expect(file.name).toBeDefined();
    expect(expectedFilename).toEqual(name);
  });
  it("The file size should be correct", () => {
    const name = "file_name"
    const size = 10;
    const file = MockFile.create(name, size, { type: "plain/txt"});
    expect(file.size).toEqual(size);
  });
})