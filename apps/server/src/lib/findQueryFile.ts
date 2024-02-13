import { readdir } from "node:fs/promises";
import * as path from "path";

type Result = {
  queryPath: string;
  sourcePath?: string;
};

export default async function findQueryFile({
  sourcePath,
  dirPath,
  query,
}: {
  sourcePath?: string;
  dirPath: string;
  query: string;
}): Promise<Result | undefined> {
  try {
    const dirents = await readdir(dirPath, { withFileTypes: true });
    const hasSource = dirents.find(
      (dirent) => dirent.isFile() && dirent.name.includes(".yml"),
    );
    const currentSourcePath = hasSource ? dirPath : sourcePath;
    const folders = [];

    for (const dirent of dirents) {
      const fullPath = path.join(dirPath, dirent.name);

      if (dirent.isFile() && dirent.name === `${query}.sql`) {
        // SQL file found
        return { queryPath: fullPath, sourcePath: currentSourcePath };
      } else if (dirent.isDirectory()) {
        folders.push(fullPath);
      }
    }

    // Recursively search through all subdirectories
    for (const folder of folders) {
      const result = await findQueryFile({
        sourcePath: currentSourcePath,
        dirPath: folder,
        query,
      });

      if (result) return result;
    }

    // If no file found after checking all entries
    return;
  } catch (err) {
    throw err; // Re-throw the error to be handled by the caller
  }
}
