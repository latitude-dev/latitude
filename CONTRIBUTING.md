# Contributing to Latitude

Welcome to Latitude's open source community! We're thrilled you're considering joining us. Whether you're here to add your coding skills or to offer suggestions and insights, we cherish every contribution. Don't worry if it's your first time diving into an open source project—our community is here to support and guide you every step of the way!

**To ensure your work has the best chance of being accepted, please read this
before contributing anything!**

The [Open Source Guides](https://opensource.guide) website has a collection of resources for individuals, communities, and companies. These resources help people who want to learn how to run and contribute to open source projects. Contributors and people new to open source alike will find the following guides especially useful:

-   [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
-   [Building Welcoming Communities](https://opensource.guide/building-community/)

Thank you for your contribution to Latitude!

## Contents

[Create your first issue](#create-an-issue)

[Contribute Code](#contribute-code)

## Create an Issue

Issues can include bugs, feature ideas, docs improvements, database connector requests, and any other suggestions or ideas you have for improving Latitude.

[Create an issue here](https://github.com/latutude-dev/latutude/issues/new/choose)

### How to write a good issue

1. Ensure you review existing documentation and issues prior to submission to avoid duplicates.
2. Contribute to existing issues by providing your input and signify its relevance with a thumbs-up reaction.
3. Select the appropriate issue template for your submission: Bug Report, Documentation Request, Feature Request, or Source Connector Request.
4. Craft a concise and informative title for your issue.
5. Provide detailed information in your issue report, including system specifications, error logs, and reproducible steps, to facilitate efficient assistance.

### Resolving issues

If you create a new issue, someone from the Latitude team will respond within 24 hours.

If you have a solution for an issue someone else posted, please comment on that issue with the solution.

### Private information

If your problem relates to sensitive or private information, please don't post any of your data in an issue. We suggest creating a small test dataset that can reproduce the problem without revealing any private info, and posting that data in the issue. If that's not possible, please reach out to support@latitude.so.

## Contribute Code

### Getting Started

Follow these steps to test your changes, once you've started the example project (per steps below),
you should be able to open the `Latitude Development Workspace` on `localhost:3000`. Any subsequent changes you make will be reflected on the website.

Open a terminal and make sure `pnpm` is installed with:

```bash
npm i -g pnpm
```

In the project root folder, run:

```bash
pnpm install
```

After executing the commands above, you should have the project setup in place. Our project is structured as a monorepo, which includes an `apps/server` directory where the main Latitude application resides. This is the application that users will interact with. Additionally, we have a `packages` directory that contains various packages used by the app.

When developing a new feature or fixing an issue, it is recommended to use the Latitude CLI in development mode. For this purpose, you can create a new Latitude data project within the `./sites` directory. Please note that all files within this folder are configured to be ignored by Git.

The first step in your development process should be to build the Latitude CLI in development mode. This can be achieved by running the appropriate command:

```bash
cd ./packages/cli
pnpm run dev
```

Once the CLI is running you can create your development project by running:

```bash
cd ./sites
pnpm run latitude-dev start
```

Now you can start developing your feature or fix in the project you just created.

```bash
cd ./sites/your-project
pnpm run latitude-dev dev
```

Now start dev mode in the packages you want to change. To do that go to the repo
root and start the packages you want to refresh:

Add the `--filter=./packages/PACKAGE_YOU_WANT_TO_REFRESH` for each package you want to refresh.

Example:

```bash
pnpm dev --filter=./packages/client/core --filter=./packages/client/react --filter=./packages/embedding
```

### Running the Test Suite locally.

The automated test suite should run upon PR creation via Github actions.
You can also run the tests locally via `pnpm test` or with watch mode via `pnpm test:watch`. To do that enter in the package you want to test and run the command.

### Pull Requests

Pull requests are welcome! We review pull requests as they are submitted and will reach out to you with any questions or comments.

Follow these steps to submit a pull request for your changes:

1. Create a fork of the [latitude repo](https://github.com/latitude-dev/latitude)
2. Commit your changes to your fork
3. Test your changes to make sure all results are as expected
4. Format your code to prevent linting errors `pnpm run format`
5. Add a [changeset](#adding-a-changeset)
6. Open a pull request against the `main` branch of the [latitude repo](https://github.com/latitude-dev/latitude)

#### Adding a Changeset

Changesets ensure that package versions are updated correctly before releasing onto NPM.

1. `cd` to the root of the monorepo
2. `pnpm changeset`
3. Follow the steps in the CLI to add some change notes:
    1. Bump the packages that have changed (use space bar to select/deselect packages)
    2. Most things are patch changes, not major or minor patch bumps
    3. Unless you're making changes that will break someone's project, or change it in a really unexpected way, just do a patch release
4. Commit the release notes to your branch so they'll be included as part of the PR
    1. the file will be called three random words like `wild-eggs-drive.md`

### Release process

We publish Latitude packages on npmjs.com and GitHub, using [semantic versioning](https://semver.org/) to manage our package versions.

There are two types of publications: `latest`, representing stable versions, and `next`, for pre-release versions.

#### How to Do Pre-releases

Our [pre-release.yml](./.github/workflow/pre-release.yml) CI workflow automatically publishes to the `next` distribution tag on npmjs.com when changes are merged into the `next` branch.
To make a pre-release, follow these steps:

1. Switch to the `next` branch and run `git rebase main` to ensure it's up to date with the latest package versions.
2. Branch off `next` for your changes.
3. Enter the pre release mode by running `pnpm changeset pre enter next`.
3. Create a changeset for your modifications using `pnpm changeset`.
4. Open a pull request on GitHub targeting the `next` branch.

Once the pull request is merged, the CI will generate a PR with the changesets. Eventually, someone with permissions will merge this PR into `next`, triggering the publication of a pre-release.

#### How to Do Releases

Our [release.yml](./.github/workflow/release.yml) CI workflow publishes to the `latest` distribution tag on npmjs.com (the default) when changes are merged into the `main` branch.
To make a release, you should:

1. Create a new branch from `main` for your updates.
2. Generate a changeset for your changes using `pnpm changeset add`.
3. Submit a pull request on GitHub directed at the `main` branch.

Following the merge of your pull request, the CI workflow will produce a PR containing the changesets. Eventually, an authorized individual will merge this PR into `main`, resulting in the release being published.

Again, thank you for your contribution to Latitude! ❤️
