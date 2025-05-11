import { AutoCarousel } from "../dist/index.mjs";

const textBoxes = document.querySelector(".text-boxes");

new AutoCarousel(textBoxes, {
    speed: 2,
    gap: 2,
    direction: "left",
    debug: false,
    containerSelector: ".container",
});

const images = document.querySelector(".images");

new AutoCarousel(images, {
    speed: 1,
    gap: 32,
    direction: "left",
    containerSelector: ".container",
});

const small = document.querySelector(".small");

new AutoCarousel(small, {
    speed: 1,
    gap: 8,
    direction: "right",
    debug: true,
    containerSelector: ".container",
});
