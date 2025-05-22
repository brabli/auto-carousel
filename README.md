![Image](https://github.com/user-attachments/assets/6932a98b-dba8-42ee-8124-15f9e48e55a3)

# auto-carousel

A zero dependency, easy to use, infinitely scrolling carousel for vanilla JavaScript or Typescript.

## Installation

Install with `npm`, or any other package manager that supports `npm` packages:

```sh
npm install auto-carousel
```
## Usage

Initialise an instance of `AutoCarousel` with an `HTMLElement` that has child elements, for example:

```html
<div id="some-element">
    <div>Slide 1</div>
    <div>Slide 2</div>
    <div>Slide 3</div>
</div>
```

```js
import { AutoCarousel } from "auto-carousel";

const elmt = document.getElementById("some-element");

new AutoCarousel(elmt);
```

Or just use a CSS selector:
```js
new AutoCarousel("#some-element");
```

All immediate children of the provided or found element will be used as the carousel slides.

You can also pass in some options to customise the behaviour of the carousel, see the section below.

## Options

There are a few available *optional* options to customise the carousel behaviour. Options and their default values are shown here:

```ts
new AutoCarousel(elmt, {
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


