# Unit & Component Tests

This directory contains Vitest tests organized by layer:

```
tests/
├── setup.ts          # Global test setup (jest-dom, cleanup)
├── unit/             # Pure logic tests (utils, api-client, helpers)
└── components/       # React component tests (RTL)
```

## Run

```bash
npm test              # run all tests
npm run test:ui       # vitest UI
npm run test:coverage # with coverage report
```
