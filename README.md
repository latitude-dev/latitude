<div align="center">
  <a href="https://latitude.so?utm_source=github" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/latitude-dev/latitude/assets/5465249/4783e122-7150-4bcc-96e0-a3c9c4c1c53b">
    <img alt="Latitude Logo" src="https://github.com/latitude-dev/latitude/assets/5465249/92cd5508-6177-485a-a758-67d71e2cd5ce" width="280"/>
  </picture>
  </a>
</div>

<br/>

<h1 align="center" style="border: none; margin-bottom: 8px;">The open-source framework for embedded analytics</h1>

<div align="center">
The missing analytics layer between your database and your users.
</div>

  <p align="center">
    <br />
    <a href="https://docs.latitude.so" rel="dofollow"><strong>See documentation →</strong></a>
    <br />
    <br/>
    <a href="https://github.com/latitude-dev/latitude/issues/new">Report Bug</a>
    ·
  <a href="https://trylatitude.slack.com/join/shared_invite/zt-17dyj4elt-rwM~h2OorAA3NtgmibhnLA#/shared-invite/email">Join Our Slack</a>
    ·
    <a href="https://github.com/orgs/latitude-dev/projects/1">Roadmap</a>
    ·
    <a href="https://x.com/trylatitude">X</a>
  </p>

<p align="center">
  <a href="https://www.npmjs.com/package/@latitude-data/cli">
    <img src="https://img.shields.io/npm/v/@latitude-data/cli" alt="NPM">
  </a>
  <a href="https://www.npmjs.com/package/@latitude-data/server">
    <img src="https://img.shields.io/npm/dm/@latitude-data/server" alt="npm downloads">
  </a>
  <img src="https://github.com/latitude-dev/latitude/actions/workflows/linter.yml/badge.svg" alt="Linter">
  <img src="https://github.com/latitude-dev/latitude/actions/workflows/test.yml/badge.svg" alt="Tests">
</p>

## 🌈 Why Latitude?

Latitude lets you create API endpoints on top of your database/warehouse using just SQL, and embed interactive visualizations natively in your favorite frontend framework or through an iframe.

It's fast to get started, easy to maintain, and scales with your data.

## ✨ Features

- ☁️ Connect to any database or data warehouse

- 📊 Easily compose parameterized SQL queries and expose them as API endpoints

- 📦 Built-in cache layer for lightning-fast query performance

- 🛠 Integrations with all common frontend frameworks (React, Svelte, Vue, VanilaJS)

- 🎨 Optional layout engine to build standalone dashboards using Svelte and Tailwind

- 🖥️ Support for embedding dashboards via iframe

- 🌎 Deploy with a single command `latitude deploy`

- 🔒 SSL-ready, encrypted parameters in url and parameterized queries to protect against SQL injection attacks

- 👥 Open-source driven by the community

## 💫 Examples

You can find sample projects using Latitude in action in the [examples](https://github.com/latitude-dev/latitude/tree/main/examples) directory.

## 📚 Table Of Contents

- [Quick start](https://github.com/latitude-dev/latitude#-quick-start)
- [Connect to your data sources](https://github.com/latitude-dev/latitude#-connect-to-your-data-sources)
- [Write your SQL queries](https://github.com/latitude-dev/latitude#-write-your-sql-queries)

- [Native frontend integration](https://github.com/latitude-dev/latitude#-native-frontend-integration)
  - [Integrate with your frontend](https://github.com/latitude-dev/latitude#-integrate-with-your-frontend)
- [Layout engine and iframe embedding](https://github.com/latitude-dev/latitude#-layout-engine-and-iframe-embedding)
  - [Use our layout engine](https://github.com/latitude-dev/latitude#-optional-use-our-layout-engine)
  - [Embedding a standalone dashboard](https://github.com/latitude-dev/latitude#-embedding-a-standalone-dashboard)
- [Deploy](https://github.com/latitude-dev/latitude#-deploy)
- [Community](https://github.com/latitude-dev/latitude#-community)
- [Contributing](https://github.com/latitude-dev/latitude#-contributing)
- [Links](https://github.com/latitude-dev/latitude#-links)

## ⚡ Quick start

Here’s a quick getting started guide to get the sample app up and running:

### 1. Install Latitude

Run the following command to install the Latitude CLI globally on your machine:

```
npm install -g @latitude-data/cli
```

Note that if you're using Windows, you might need to follow these instructions first: [Windows setup](https://docs.latitude.so/guides/getting-started/windows-compatibility).

### 2. Create the starter project

Run this command to create a new Latitude project:

```
latitude start
```

The CLI will ask you the project name. Once you’re done, you’ll have a new
directory with a sample app that you can run and customize.

### 3. Navigate to the project and run the app

```
cd my-new-app
```

```
latitude dev
```

This will start the development server and open the sample app in your browser.

## 🔗 Connect to your data sources

Set up the connection to your database or data warehouse through a simple configuration file.

```yaml source.yml
type: postgres
details:
  database: db
  user: username
  password: ••••••••••••••••
  host: postgres.example.com
  port: 5432
  schema: public
  ssl: true
```

We do not recommend to store your database credentials in the configuration file. Instead, you can use environment variables to store your credentials securely. Find out more about this in the [documentation](https://docs.latitude.so/sources/credentials).

We support the following sources:

- [x] [Athena](https://docs.latitude.so/sources/athena)
- [x] [BigQuery](https://docs.latitude.so/sources/bigquery)
- [x] [Clickhouse](https://docs.latitude.so/sources/clickhouse)
- [x] [Databricks](https://docs.latitude.so/sources/databricks)
- [x] [DuckDB](https://docs.latitude.so/sources/duckdb)
- [x] [MS SQL](https://docs.latitude.so/sources/mssql)
- [x] [MySQL](https://docs.latitude.so/sources/mysql)
- [x] [PostgreSQL](https://docs.latitude.so/sources/postgresql)
- [x] [Redshift](https://docs.latitude.so/sources/redshift)
- [x] [Snowflake](https://docs.latitude.so/sources/snowflake)
- [x] [SQLite](https://docs.latitude.so/sources/sqlite)
- [x] [Trino](https://docs.latitude.so/sources/trino)

Find out more about connecting to sources in the [documentation](https://docs.latitude.so/sources/how-to-configure-sources).

## 🧑‍💻 Write your SQL queries

Latitude makes it easy to fetch data from your database and expose it via an API endpoint in JSON format so that it can be easily consumed by your frontend application.

You can use parameters in your SQL queries to filter data based on external inputs. For example, you can create a query that fetches movies released between two years:

#### /queries/titles.sql

```sql titles.sql
select id,
       title,
       release_year,
       type,
       runtime,
       imdb_score
from titles
where release_year between { param('start_year') } and { param('end_year') }
```

Additionally, you can reference other queries in your SQL to create composable data pipelines. For example, this is a query that uses the results of the previous one to display the count of titles released each year:

#### /queries/titles-agg.sql

```sql titles-agg.sql
select
  release_year,
  count(*) as total_titles,
from { ref('titles') }
group by 1
order by 1 asc
```

### Automatic API endpoints

Latitude will automatically expose these queries as API endpoints that you can fetch from your frontend application.

To use these endpoints with parameters, you can pass them in the URL. For example, to fetch movies released between 2000 and 2020, you can do:

```bash
curl http://localhost:3000/titles?start_year=2000&end_year=2020
```

## ⌨️ Native frontend integration

### Integrate with your frontend

Use our React components to fetch data from your API and display it in your application.

```bash
npm install @latitude-data/react
```

Once the React package is installed in your project, add the LatitudeProvider:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LatitudeProvider } from '@latitude-data/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LatitudeProvider
      apiConfig={{ host: 'https://localhost:3000' }}
    >
      <Example />
    </LatitudeProvider>
  </React.StrictMode>,
);
```

You can fetch data from your Latitude data server with the useQuery hook:

```jsx
import { useQuery } from '@latitude-data/react';
import { useCallback } from 'react';

export default function Example() {
  const { data: movies, isFetching, compute } = useQuery({
    queryPath: 'titles',
    params: {
      start_year: '2000',
      end_year: '2020',
    },
  });

  const caption = isFetching ? 'Loading movies...' : 'List of movies';
  const refresh = useCallback(() => compute(), [compute]);

  return (2
    <div className='p-4 flex flex-col gap-y-4'>
      <h1 className='text-4xl font-medium'>React Example with Latitude</h1>
      <Button onClick={refresh}>Refresh</Button>

      <Table>
        {!isFetching ? <MovieList movies={movies!} /> : <MovieListSkeleton />}
        <TableCaption>{caption}</TableCaption>
      </Table>
    </div>
  );
}
```

## 🖥️ Layout engine and iframe embedding

### Use our layout engine

If you want to build standalone dashboards, you can use our layout engine to create a dashboard with multiple visualizations.

To do so, simply create an `index.html` file under the `views` directory with the following content:

#### /views/index.html

```jsx
<View class='gap-8 p-8'>
  <Row>
    <Text.H2 class='font-bold'>Netflix titles released over time</Text.H2>
  </Row>
  <Row>
    <LineChart query='titles-agg' x='release_year' y='total_titles' />
  </Row>
  <Row>
    <Table query='titles' />
  </Row>
</View>
```

This will create a dashboard with a line chart and a table displaying the data fetched from the `titles` and `titles-agg` queries.

This dashboard can be accessed by navigating to `http://localhost:3000/`.

To pass parameters to the queries, add them to the URL as query parameters. For example: `http://localhost:3000/?start_year=2000&end_year=2020`.

Another option is to use our `<Input>` component to create a form that allows users to input parameters. Find out more about this in the [documentation](https://docs.latitude.so/views/components/inputs/text).

### Embedding a standalone dashboard

You can embed the dashboard in your application using an iframe. To do so, simply add the following code to your application:

```html
<iframe
  src="http://localhost:3000/queries?start_year=2000&end_year=2020"
  width="100%"
  height="600"
/>
```

If you're using React, we released a React component that simplifies the process of embedding dashboards in your application. [Check out the documentation](https://docs.latitude.so/guides/embed/react-embed) to learn more.

## 🌍 Deploy

To deploy your Latitude project, run the following command:

```bash
latitude deploy
```

This will deploy your project to the Latitude cloud, and you will get a URL where your project is hosted.

You can also deploy your project to your own infrastructure. Find out more about this in the [documentation](https://docs.latitude.so/guides/deploy/docker).

## 👥 Community

The Latitude community can be found on
[Slack](https://trylatitude.slack.com/join/shared_invite/zt-17dyj4elt-rwM~h2OorAA3NtgmibhnLA#/shared-invite/email)
where you can ask questions, voice ideas, and share your projects with other
people.

## 🤝 Contributing

Contributions to Latitude are welcome and highly appreciated.

If you are interested in contributing, please join us on our [Slack
community](https://trylatitude.slack.com/join/shared_invite/zt-17dyj4elt-rwM~h2OorAA3NtgmibhnLA#/shared-invite/email),
open an [issue](https://github.com/evidence-dev/evidence/issues/new), or
contribute a pull request.

## 🔗 Links

- [Home page](https://latitude.so?utm_campaign=github-readme)
- [Documentation](https://docs.latitude.so/)
- [Slack community](https://trylatitude.slack.com/join/shared_invite/zt-17dyj4elt-rwM~h2OorAA3NtgmibhnLA#/shared-invite/email)
- [X / Twitter](https://x.com/trylatitude)
