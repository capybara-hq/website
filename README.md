# Capybara website

The source of [capybarahq.com](https://capybarahq.com), the website of
[Capybara](https://github.com/capybara-hq/core): an open-source, self-hosted agent platform that a
whole company raises together.

Deployed on Vercel from `main`; every pull request gets a preview deployment.

## Development

A Next.js App Router site exported as static files (`output: "export"`).

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # static site in out/
```

Copy lives in `content/zh.ts` and `content/en.ts`; the live product preview in the hero is
`public/app/capy-app.js` (Capybara's conversation page, mounted in a shadow root).

## Contributing

Changes reach `main` through pull requests linked to an issue, like every capybara-hq repository.
See the [contributing guide](https://github.com/capybara-hq/.github/blob/main/CONTRIBUTING.md).

## License

Apache-2.0
