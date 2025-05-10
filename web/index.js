import { AutoCarousel } from "../dist/index.mjs";

const textBoxes = document.querySelector(".text-boxes");

new AutoCarousel(textBoxes, {
    speed: 2,
    gap: 32,
    direction: "left",
    debug: true,
});

const images = document.querySelector(".images");

new AutoCarousel(images, {
    speed: 1,
    gap: 32,
    direction: "left",
});
