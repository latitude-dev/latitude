# Fly.io sample project

This project showcases how to deploy a Latitude application to [Fly.io](https://fly.io). Fly.io
is a platform that allows you to deploy your applications to a global network
of virtual machines.

## Deploying to production

Follow these steps to deploy your application to Fly.io:

### Install the Fly.io CLI

Run the command below to download and install the Fly.io command line tool.

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

### Initialize Your Project

After installing the CLI, set up your project on Fly.io with:

   ```bash
   fly launch
   ```

During this process, Fly automatically recognizes the Dockerfile and Fly.io configuration included in this project. Confirm the prompted settings to proceed.

### Deploy the Application 

Fly.io works with docker containers and automatically builds and deploys your application. Hopefully, Latitude provides tools to build a docker container with your application. Here's how to do it:

1. First, prepare your project for deployment by running the following command.

   ```bash
   latitude prepare
   ```
    This command runs some preconfiguration steps required in order to properly build the docker container.

2. Now you can deploy your application to Fly.io by running the following command:

   ```bash
    fly deploy
   ```
    And that's it! Your application is now deployed to Fly.io.

For additional configuration options, refer to the [Fly.io Configuration Documentation](https://fly.io/docs/reference/configuration/).

## Adding secrets
If the project requires the use of secret credentials you can declare them like so:

```bash
fly secrets set LATITUDE__DATABASE_PASSWORD=mypassword
```

This command will make the secret available as an environment variable to the production build at runtime. [Read here](https://docs.latitude.so/sources/credentials) how to use environment variables in Latitude projects.

## Documentation

To find more about how to deploy Latitude to your own infrastructure, refer to the [documentation](https://docs.latitude.so/guides/deploy/self-hosted).
