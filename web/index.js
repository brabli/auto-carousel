import { AutoCarousel } from "../dist/index.mjs";

const textBoxes = document.querySelector(".text-boxes");

new AutoCarousel(textBoxes, {
    stopOnHover: true,
    align: "top",
});

const images = document.querySelector(".images");

new AutoCarousel(images, {
    speed: 1,
    gap: 32,
    direction: "right",
    align: "bottom",
    stopOnHover: true,
});

const small = document.querySelector(".small");

new AutoCarousel(small, {
    speed: 1,
    gap: 8,
    direction: "right",
});

const squaresMed = document.querySelector(".squares-med");
new AutoCarousel(squaresMed, {
    speed: 1.5,
});

const squaresSlow = document.querySelector(".squares-slow");
new AutoCarousel(squaresSlow);

const squaresFast = document.querySelector(".squares-fast");
new AutoCarousel(squaresFast, {
    speed: 2,
});
