# Release process
We publish Latitude packages in npmjs.com and GitHub. We use [semantic versioning](https://semver.org/) to manage the versioning of our packages.

We have two types of publications. We publish to `latest` which is the stable
versions 1and `next` which is the pre-release versions.


## How to do pre-releases
We have a [pre-release.yml](./.github/workflow/pre-release.yml) CI workflow that
publish to `next` dist tag in npmjs.com when changes are merged into `dev` branch.
To make a pre-release, you need to:

1. Go to `dev` branch and `git rebase main`. This is important to have
   updated version of the packages in the `dev` branch.
2. Start a branch from `dev` and do the changes you want
3. Create a changeset for your changes with `pnpm changeset pre next`. `next` is the tag that will be publish in
   npmjs.com
4. Open a pull request in GitHub pointing to `dev`

When the pull request is merged, the CI workflow will create a PR with the
changesets. At some point someone with permissions will merge this branch into `dev` and a pre-release will be published.

## How to do releases
We have a [release.yml](./.github/workflow/release.yml) CI workflow that
publish to `latest` dist tag in npmjs.com (default) when changes are merged into `main` branch.
To make a release, you need to:

1. Start a branch from `main` and do the changes you want
1. Create a changeset for your changes with `pnpm changeset add`.
3. Open a pull request in GitHub pointing to `main`

When the pull request is merged, the CI workflow will create a PR with the
changesets. At some point someone with permissions will merge this branch into `main` and a release will be published.
