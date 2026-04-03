# E2E Tests

End-to-end tests using Playwright.

```
e2e/
├── fixtures/         # Shared test fixtures & page objects
└── *.spec.ts         # Test specs
```

## Run

```bash
npm run test:e2e          # headless
npm run test:e2e:ui       # interactive UI mode
npx playwright show-report # view html report
```
