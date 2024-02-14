import findQueryFile from "../../lib/findQueryFile";
import { json } from "@sveltejs/kit";
import { PostgresConnector } from '@latitude-sdk/postgresql-connector'

export async function GET({ params }: { params: { query: string } }) {
  const { query } = params;
  const found = await findQueryFile({ query, dirPath: "/static" });
  if (!found) return new Response("Not found", { status: 404 });

  // @ts-ignore
  const connector = carlosFactory(found.sourcePath);
  const coo = new PostgresConnector({
    host: "localhost",
    port: 543,
    database: "test",
    user: "test",
    password: "test",
  });

  console.log(coo);

  try {
    const queryResult = await connector.query({
      path: found.queryPath,
      params,
    });

    return json(queryResult.toJSON());
  } catch (e) {
    // TODO: respond with an error including the details in json format
    // @ts-ignore
    return new Response(e.message, { status: 500 });
  }
}
