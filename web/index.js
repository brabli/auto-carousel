import { AutoCarousel } from "../dist/index.mjs";

const textBoxes = document.querySelector(".text-boxes");

new AutoCarousel(textBoxes, {
    stopOnHover: true,
});

const images = document.querySelector(".images");

new AutoCarousel(images, {
    speed: 1,
    gap: 32,
    direction: "right",
});

const small = document.querySelector(".small");

new AutoCarousel(small, {
    speed: 1,
    gap: 8,
    direction: "right",
});
