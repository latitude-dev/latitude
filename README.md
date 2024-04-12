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
    <a href="https://twitter.com/trylatitude">X</a>
  </p>

<p align="center">
  <a href="https://www.npmjs.com/package/@latitude-data/cli">
    <img src="https://img.shields.io/npm/v/@latitude-data/cli" alt="NPM">
  </a>
  <a href="https://www.npmjs.com/package/@latitude-data/cli">
    <img src="https://img.shields.io/npm/dm/@latitude-data/cli" alt="npm downloads">
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

- 🔒 SSL-ready, encrypted parameters in url and parameterized queries to protect against SQL injection attacks

- 👥 Open-source driven by the community

## 💫 Examples

You can find sample projects using Latitude in action in the [examples](https://github.com/latitude-dev/latitude/examples) directory.

## 📚 Table Of Contents

- [Quick start](https://github.com/latitude-dev/latitude#-quick-start)
- [Connect to your data sources](https://github.com/latitude-dev/latitude#-connect-to-your-data-sources)
- [Write your SQL queries](https://github.com/latitude-dev/latitude#-write-sql-queries)

- [Native frontend integration](https://github.com/latitude-dev/latitude#-native-frontend-integration)
  - [Integrate with your frontend](https://github.com/latitude-dev/latitude#-integrate-with-your-frontend)
- [Layout engine and iframe embedding](https://github.com/latitude-dev/latitude#-layout-engine-and-iframe-embedding)
  - [Use our layout engine](https://github.com/latitude-dev/latitude#-optional-use-our-layout-engine)
  - [Embedding a standalone dashboard](https://github.com/latitude-dev/latitude#-embedding-a-standalone-dashboard)

## ⚡ Quick start

Here’s a quick getting started guide to get the sample app up and running:

### 1. Install Latitude

Run the following command to install the Latitude CLI globally on your machine:

```
npm install -g @latitude-data/cli
```

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

We support the following sources:
- [x] Athena
- [x] BigQuery
- [x] Clickhouse
- [x] CSV files
- [x] Databricks
- [x] DuckDB
- [x] MS SQL
- [x] MySQL
- [x] PostgreSQL
- [x] Redshift
- [x] Snowflake
- [x] SQLite
- [x] Trino

## 🧑‍💻 Write your SQL queries

Latitude makes it easy to fetch data from your database and transform it into a format that can be consumed by your frontend application.

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

Latitude will automatically expose these queries as API endpoints that you can fetch from your frontend application.

## ⌨️ Native frontend integration

### Integrate with your frontend

Use our React components to fetch data from your API and display it in your application.

```bash
npm install @latitude-data/react
```

Once the React package is installed in your project, you need to place our Latitude data provider at the root of your app as shown below:

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

After installing the package, you can fetch data from your Latitude data server with the useQuery hook.

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

To do so, simply create an `index.html` file under the `queries` directory with the following content:

#### /queries/index.html
```jsx
<View class="gap-8 p-8">
  <Row>
    <Text.H2 class="font-bold">Netflix titles released over time</Text.H2>
  </Row>
  <Row>
    <LineChart
      query="titles-agg"
      x="release_year"
      y="total_titles"
    />
  </Row>
  <Row>
    <Table query="titles" />
  </Row>
</View>
```

This will create a dashboard with a line chart and a table displaying the data fetched from the `titles` and `titles-agg` queries.

This dashboard can be accessed by navigating to `http://localhost:3000/queries`. To pass parameters to the queries, add them to the URL as query parameters. For example: `http://localhost:3000/queries?start_year=2000&end_year=2020`.

### Embedding a standalone dashboard

You can embed the dashboard in your application using an iframe. To do so, simply add the following code to your application:

```html
<iframe src="http://localhost:3000/queries?start_year=2000&end_year=2020" width="100%" height="600" />
```

If you're using React, we released a React component that simplifies the process of embedding dashboards in your application. [Check out the documentation](https://docs.latitude.so/guides/embed/react-embed) to learn more.

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
- [X](https://twitter.com/trylatitude)