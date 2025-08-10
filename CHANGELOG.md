# Auto Carousel Changelog

## X.X.X - XXXX-XX-XX

## X.X.X - XXXX-XX-XX
- Update project to use `pnpm` to manage dev dependencies
- Replace window resize listener with a mutation observer
- Add additional check on the number of slides, crashing the carousel if it's too many (>1000). This is to prevent bugs that would otherwise cause the browser to crash.
- Fix issue with large slides causing carousel to not loop cleanly

## 1.1.0 - 2025-06-05
- Add `stretch` as available value for `align` option
- Wait for any images in slides to load before calculating how many additional slides to create
- Add more details to some debug messages
- Improve how debug messages are formatted

## 1.0.0 - 2025-05-22
- Initial release

