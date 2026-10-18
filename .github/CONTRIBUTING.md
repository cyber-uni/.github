# Contributing

Thanks for helping. This guide applies to every spikyuni repository unless
the repository has its own `CONTRIBUTING.md`.

## Before you start

- For anything larger than a small fix, open an issue first so the approach can be
  agreed before you write the code.
- Read the repository's `AGENTS.md`, if it has one. It lists the commands and the
  constraints that apply there, for people and coding agents alike.

## Making a change

1. Fork the repository and create a branch from `main`.
2. Install with `pnpm install`. The pnpm version comes from `packageManager` in
   `package.json`.
3. Make the change, with tests.
4. Run `pnpm verify`. It runs the same gate CI runs.
5. If the change affects a published package, add a changeset with `pnpm changeset`.
6. Open a pull request. Use a [Conventional Commits](https://www.conventionalcommits.org)
   title, such as `fix(cli): reject an empty spec`.

Pull requests merge through a merge queue once the required `all-checks` context
passes.

## Conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
