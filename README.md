<svg xmlns="http://www.w3.org/2000/svg" width="287.745" height="114.086" viewBox="0 0 76.132 30.185"><g style="stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1" transform="translate(-62.46 -67.13)"><rect width="75.32" height="29.385" x="62.862" y="67.529" ry="1.641" style="fill:#f4f4f4;fill-opacity:1;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/><rect width="15.9" height="16.866" x="92.717" y="73.789" ry="0" style="fill:#a1a6e1;fill-opacity:1;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/><rect width="15.9" height="16.866" x="113.661" y="73.789" ry="0" style="fill:#def575;fill-opacity:.725389;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/><rect width="3.876" height="16.881" x="134.317" y="73.781" ry="0" style="fill:#f59a9a;fill-opacity:1;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/><rect width="15.9" height="16.866" x="71.773" y="73.789" ry="0" style="fill:#70fab1;fill-opacity:1;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/><rect width="3.876" height="16.881" x="62.861" y="73.781" ry="0" style="fill:#f59a9a;fill-opacity:1;stroke:#000;stroke-width:.8;stroke-dasharray:none;stroke-opacity:1"/></g><path d="m100.02 78.685-3.68 3.537 3.68 3.537v-2.384h5.17V81.07h-5.17zm20.804 0-3.68 3.537 3.68 3.537v-2.384h5.17V81.07h-5.17zm-41.608 0-3.68 3.537 3.68 3.537v-2.384h5.17V81.07h-5.17z" style="fill:#f4f4f4;stroke:#000;stroke-width:.552;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" transform="translate(-62.46 -67.13)"/></svg>

# auto-carousel

Zero dependency, easy to use, infinitely scrolling carousel for vanilla JavaScript or Typescript.

## Installation

Install with `npm`, or any other package manager that supports `npm` packages:

```sh
npm install auto-carousel
```
## Usage

Initialise an instance of `AutoCarousel` with an `HTMLElement`:

```js
import { AutoCarousel } from "auto-carousel";

const elmt = document.getElementById("some-element");

new AutoCarousel(elmt);
```

Or just use a CSS selector:
```js
new AutoCarousel("#some-element");
```

All immediate children of the provided or found element will be treated as the carousel slides.

## Options

There are a few available *optional* options to customise the carousel behaviour. Default values are shown here:

```ts
new AutoCarousel(element, {
    align: "middle",
    debug: false,
    direction: "left",
    gap: 32,
    speed: 1,
    stopOnHover: false,
})
```

`align: "top" | "middle" | "bottom"`
Align the slides at the top, middle or bottom of the container respectively.

`debug: boolean`
Display debug messages in the console. You probably don't want to use this in prod.

`direction: "left" | "right"` Direction the carousel should move.

`gap: number` Gap between slides in pixels.

`speed: number` Speed the carousel should move at. Set this based on vibe, `1` is the base speed while `0.5` is around half that speed while `2` is around double the speed and so on.

`stopOnHover: boolean` Pauses the carousel if the mouse is hovered over it. Carousel resumes again once the mouse leaves.

## Contributing

There are some `npm` commands you can run inside this repo:

`npm run build` Build the minified package for prod.

`npm run watch` Watch for changes and build the package on save.

`npm run serve` Start a local web server using [local-web-server](https://www.npmjs.com/package/local-web-server). When writing this package I added a `/web` directory with a basic web page to test different carousel options.


