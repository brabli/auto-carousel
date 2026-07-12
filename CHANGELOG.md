# Auto Carousel Changelog

## X.X.X - XXXX-XX-XX

## 1.3.0 - 2026-07-12
- Add runtime validation of options
- Export the `AutoCarouselOptions` type for TypeScript consumers
- Remove stale package-lock.json
- Carousel now respects when the user prefers reduced motion and doesn't play
- Wait for cloned images to finish loading before measuring the container, preventing incorrect sizing when slides contain images
- Recycle slides by moving the edge slide instead of cloning and destroying an element on every loop
- Fix crash when elements total width equalled zero pixels
- Fix crash when an image failed to load
- Fix guard clause never being able to run

## 1.2.0 - 2025-08-10
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

