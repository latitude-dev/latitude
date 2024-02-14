import { describe, it, expect, beforeAll, afterEach } from "vitest";
import * as fs from "fs/promises";
import { vi } from "vitest";
import findQueryFile, {
  ROOT_FOLDER,
  QueryNotFoundError,
  SourceFileNotFoundError,
} from "./findQueryFile"; // Replace with the actual path to your module

// Mocks fs module
vi.mock("fs/promises", () => ({
  access: vi.fn(),
  readdir: vi.fn(),
}));

describe("findQueryFile", () => {
  const mockFilePath = "subfolder/query";
  const mockSourcePath = `${ROOT_FOLDER}/subfolder/source.yml`;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the correct paths if the query file and source file exist", async () => {
    vi.mocked(fs.access).mockResolvedValue(); // Pretend the file exists
    // @ts-ignore
    vi.mocked(fs.readdir).mockResolvedValue(["source.yml", "anotherfile.txt"]);

    const result = await findQueryFile(mockFilePath);

    expect(result).toEqual({
      queryPath: "query.sql",
      sourcePath: mockSourcePath,
    });
  });

  it("should throw a QueryNotFoundError if the .sql file does not exist", async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error("File not found"));

    await expect(findQueryFile(mockFilePath)).rejects.toThrow(
      QueryNotFoundError
    );
  });

  it("should throw a SourceFileNotFoundError if the .yml file does not exist", async () => {
    vi.mocked(fs.access).mockResolvedValue(); // Pretend the SQL file exists
    // @ts-ignore
    vi.mocked(fs.readdir).mockResolvedValue(["anotherfile.txt"]); // Pretending there's no YML file

    await expect(findQueryFile(mockFilePath)).rejects.toThrow(
      SourceFileNotFoundError
    );
  });
});
