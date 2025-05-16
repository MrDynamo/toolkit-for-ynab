# Release Workflow

## Update Docs

`yarn gen:docs`

`git add . && git commit --no-verify -m "release: update feature docs" && git push`

## Github

Update src/manifest.json

`git add . && git commit --no-verify -m "release: bump manifest version"`

`npm version <patch|minor|major>`

`git push && git push --tags`

Create Github release

Use auto-generate release notes feature on release page.

## Sentry

`yarn sentry:create && yarn build:production`

`yarn sentry:upload --rewrite`

## Upload to webstores

1. Upload Chrome (.zip)
2. Upload Firefox (.zip)
3. Upload Edge (.zip)
