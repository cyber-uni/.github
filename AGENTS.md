# AGENTS.md

This is the cyberuni-agent organization's `.github` repository. It holds three
things, and GitHub reads each from a fixed path:

- `profile/README.md`: the organization profile page.
- `.github/*.md` and `.github/ISSUE_TEMPLATE/`: default community health files for
  every repository in the organization that lacks its own.
- `.github/workflows/pnpm-*.yml`, `.github/actions/`, and `workflow-templates/`:
  reusable workflows, the composite actions they call, and starter workflows.

[README.md](README.md) is the consumer contract: what each workflow does, how to pin
it, and how a release is cut. Keep it the one home for those facts.

## Working here

- `node --test '.github/**/*.test.mjs' 'test/*.test.mjs'` runs every test. There is
  no `package.json` and no dependency to install.
- CI also runs actionlint, with shellcheck, over every workflow.

## Rules

- **Pin every external `uses:` to a full commit SHA**, with the tag as a trailing
  comment: `uses: actions/checkout@<sha> # v7.0.1`. Docker images pin a digest.
  `test/pins.test.mjs` fails otherwise.
- **Refer to this repo's own actions by the line alias**, `cyberuni-agent/.github/.github/actions/<name>@v1`.
  A reusable workflow cannot use a relative `./` path: it resolves against the
  caller's checkout. Never `@main`.
- **Never interpolate `${{ inputs.* }}` into a `run:` script.** Pass it through
  `env:` and quote the variable.
- **Declare the narrowest `permissions:` per job**, and list in the workflow header
  what the caller must grant. A called workflow cannot exceed the caller's grant;
  asking for more is a startup failure.
- **Classify every change against the breaking-change list in README.md** before
  calling it a minor or patch release.
- Comments record why a line is the way it is, including the incident that taught
  it. Keep them; update them when the reason changes.

## The glyph

The org mark is a lowercase `u` with the four-point AI spark above it, inside the shared
cyber-* frame (`docs/design/icon-system.md` in `cyberuni/cyber-mux`): *uni*, and agents.
It was candidate C of four; the others were the cyber-civitas citizens, a plug with the
spark, and the spark alone.

`brand/` holds one drawing in five files: `logo.svg` (self-theming), `logo-light.svg` and
`logo-dark.svg` (ink `#10111a` and `#f7f8f8`), and the org avatar renders
`org-avatar-light.png` and `org-avatar-dark.png` (512px, rendered from the pair). GitHub
takes only raster images for an avatar, so those stay PNG. A glyph change touches all five.
