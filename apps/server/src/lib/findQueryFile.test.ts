import mockFs from "mock-fs";
import findQueryFile from "./findQueryFile";

describe("findQueryFile", () => {
  beforeAll(() => {
    // Setup the mock file system before all tests
    mockFs({
      "path/to/dir": {
        "test.sql": "SELECT * FROM table;",
        nested: {
          "test.sql": "SELECT * FROM table;",
        },
        "source.yml": "source: true",
      },
    });
  });

  afterAll(() => {
    // Restore the file system after all tests
    mockFs.restore();
  });

  it("should find an SQL file in the given directory", async () => {
    const result = await findQueryFile({
      dirPath: "path/to/dir",
      query: "test",
    });
    expect(result).toEqual({
      queryPath: "path/to/dir/test.sql",
      sourcePath: "path/to/dir",
    });
  });

  it("should find an SQL file in a nested directory", async () => {
    const result = await findQueryFile({
      dirPath: "path/to/dir/nested",
      query: "test",
    });
    expect(result).toEqual({
      queryPath: "path/to/dir/nested/test.sql",
      sourcePath: undefined,
    });
  });

  it("should return undefined when the SQL file is not found", async () => {
    const result = await findQueryFile({
      dirPath: "path/to/dir",
      query: "nonexistent",
    });
    expect(result).toBeUndefined();
  });
});
