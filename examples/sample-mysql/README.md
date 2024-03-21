# Latitude starter project

This project is an example of how to connect to a MySQL database.

## Developing

To start developing in this project, first ensure you have Node.js >= 18 installed. Then, install the Latitude CLI:

```
npm install -g latitude-cli
```

After cloning the repository, run the following command to spin up the dev server:

```
latitude dev
```

This will start the server in development mode, and you can access the application at `http://localhost:3000`.

## Project Structure

The project is structured as follows:

`queries` - This directory contains the SQL files that define the queries used to fetch data from the database.

`views` - This directory contains the HTML files that define the layout and interface of the application.

Additionally you'll find a `sources.yml` file in the queries directory. This file defines the data sources that the project uses. By default, it's set to use the DuckDB adapter to let you add CSV files as data sources. You can change this to use other adapters.

## Documentation

To find more about how to use Latitude, refer to the [documentation](https://docs.latitude.so).
