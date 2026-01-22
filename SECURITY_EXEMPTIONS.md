# Security Audit Exemptions

This document lists known security vulnerabilities that have been reviewed and accepted.

## Rationale

These vulnerabilities exist in optional development dependencies used only for performance testing and are not bundled in the production application.

| Vulnerability       | Package       | Severity | Justification                                                  |
| ------------------- | ------------- | -------- | -------------------------------------------------------------- |
| GHSA-pxg6-pf52-xh8x | cookie <0.7.0 | Moderate | Only in lighthouse-ci dev dependency, not in production bundle |
| GHSA-pfrx-2q88-qq97 | got <11.8.5   | Moderate | Only in lighthouse-ci dev dependency, not in production bundle |
| GHSA-p6mc-m468-83gw | lodash.set    | High     | Only in lighthouse-ci dev dependency, not in production bundle |

## Mitigation

1. The `lighthouse-ci` package is only used for the optional `npm run perf` command
2. Production build does not include these dependencies
3. Consider using `@lhci/cli` directly via npx instead of the installed package
4. Regularly review and update when fixes are available

## Last Updated

2026-01-22
