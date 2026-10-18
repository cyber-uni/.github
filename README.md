# spikyuni/.github

The spikyuni organization's settings repository:

- the [organization profile](profile/README.md),
- [default community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
  for every repository that lacks its own: [code of conduct](.github/CODE_OF_CONDUCT.md),
  [contributing guide](.github/CONTRIBUTING.md), [security policy](.github/SECURITY.md),
  [support](.github/SUPPORT.md), issue forms, and a pull request template,
- reusable workflows and the [starter workflows](workflow-templates) that call them.

## Workflows

| Workflow | Does | Caller grants |
| --- | --- | --- |
| [`pnpm-verify.yml`](.github/workflows/pnpm-verify.yml) | Runs `pnpm verify` across an OS × Node matrix, installs Playwright browsers if the repo uses Playwright, uploads coverage to Codecov, and rolls up into one `all-checks` job. | `contents: read`, `id-token: write` |
| [`pnpm-release.yml`](.github/workflows/pnpm-release.yml) | Runs the publish gate, then opens the changesets Version Packages PR or publishes to npm with trusted publishing. | `contents: write`, `pull-requests: write`, `id-token: write` |
| [`pnpm-deploy-pages.yml`](.github/workflows/pnpm-deploy-pages.yml) | Builds a static site and deploys it to GitHub Pages. Fails rather than deploy an empty directory. | `contents: read`, `pages: write`, `id-token: write` |

Each workflow's inputs and their defaults are documented in its `workflow_call`
block. The caller must grant the listed permissions: a called workflow cannot
exceed them, and GitHub refuses to start one that asks for more.

The quickest start is **Actions → New workflow** in any spikyuni repository,
where the starter workflows appear under *By spikyuni*. By hand:

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push:
    branches: [main]
  merge_group:
permissions:
  contents: read
  id-token: write
jobs:
  verify:
    uses: spikyuni/.github/.github/workflows/pnpm-verify.yml@v1
```

```yaml
# .github/workflows/release.yml
name: release
on:
  push:
    branches: [main]
permissions: {}
jobs:
  release:
    uses: spikyuni/.github/.github/workflows/pnpm-release.yml@v1
    permissions:
      contents: write
      pull-requests: write
      id-token: write
```

Require **`verify / all-checks`** in the branch ruleset. The name is
`<caller job id> / all-checks`, so it stays the same when the matrix changes.

### Releasing a package

`pnpm-release.yml` uses no stored secret. Before the first release:

1. Use `@changesets/cli` v3, and give the root `package.json` `build`, `version`
   (`changeset version`) and `release` (`changeset publish`) scripts. Other script
   names are inputs.
2. Register a trusted publisher at `npmjs.com/package/<name>/access` for every
   published package. Name the repository and the **caller's** workflow file,
   `release.yml`, not `pnpm-release.yml`. Publishing fails with an auth error
   until you do.

The **publish gate** packs each package and compares it with the version on npm.
It blocks a tarball that contains test files, env files, key material or repo
metadata, and a new runtime dependency that is not first-party. Allow an expected
dependency with the `allowed-new-dependencies` input. The first-party list is
`FIRST_PARTY` in [publish-gate.mjs](.github/actions/publish-gate/publish-gate.mjs).
The report is the job summary and the `publish-gate-report` artifact.

## Versioning

**Pin `@v1`.** It is a moving tag: each backward-compatible release moves it
forward, so fixes reach you without a pull request. A breaking change ships as
`v2` and never moves `v1`. Pin an exact version such as `@v1.2.0` for a ref that
never moves, and bump it by hand.

**Never pin `@main`.** Renovate auto-merges dependency updates to `main`, so `main`
carries changes no one has released. A consumer on `@main` takes each one the
moment it merges. This broke the release of every consumer of `repobuddy/.github`
at once ([repobuddy/.github#43](https://github.com/repobuddy/.github/issues/43)).

One tag covers the whole repository: all three workflows and both actions.

A change is breaking, and needs a new major, when a consumer that changes nothing
would break:

- removing or renaming a workflow, an action, an input or an output,
- making an optional input required,
- changing a default so that existing behavior changes,
- asking the caller for a permission or secret it did not grant before,
- requiring something new of the consumer's repository, such as a newer
  `@changesets/cli` major.

### Cutting a release

```sh
git switch main && git pull
git tag -a v1.2.0 -m "v1.2.0" && git push origin v1.2.0
gh release create v1.2.0 --generate-notes
git tag -f v1 v1.2.0 && git push -f origin v1
```

The last line moves the alias. Without it, nobody pinning `@v1` gets the release.

The workflows call this repository's own actions as
`spikyuni/.github/.github/actions/<name>@v1`, because a reusable workflow
resolves `./` against the caller's checkout. A consumer on `@v1` therefore runs
the actions from `v1` too. A new major updates these refs in the same release.

## Organization setup

These settings live outside any file, so they are listed here. Each line says whether
it is in place yet.

- **Discussions:** on in this repository, which is the organization's discussion
  source. *Done.*
- **Code scanning:** CodeQL default setup, enabled for all repositories at the
  organization level. No workflow needed. *Not yet.*
- **Private vulnerability reporting:** on for every repository, so the security
  policy's **Report a vulnerability** button exists. *Not yet.*
- **Codecov:** the Codecov GitHub App installed on the organization. Uploads
  authenticate with OIDC. *Not yet.*
- **Renovate:** the Renovate GitHub App installed on the organization. Each
  repository extends `github>unional/renovate-preset`. *Not yet.*
- **Merge queue and auto-merge:** on in each repository's ruleset, with
  `all-checks` required. *Per repository, as each one moves in.*
- **Release tags:** the workflows above resolve `@v1`. Cut `v1.0.0` and the `v1`
  alias (see [Cutting a release](#cutting-a-release)) before the first consumer
  calls them. *Not yet.*
