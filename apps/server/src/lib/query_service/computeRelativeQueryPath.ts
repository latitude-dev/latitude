import { QUERIES_DIR } from '$lib/server/sourceManager'
import path from 'path'

export default function computeRelativeQueryPath({
  sourcePath, // /static/.latitude/queries/folder/source.yml
  queryPath, // folder/query.sql
}: {
  sourcePath: string
  queryPath: string
}) {
  const base = path
    .dirname(sourcePath) // /static/.latitude/queries/folder
    .slice(sourcePath.indexOf(QUERIES_DIR) + QUERIES_DIR.length + 1) // folder

  if (!base) return queryPath

  return queryPath.slice(queryPath.indexOf(base) + base.length + 1) // query.sql
}
