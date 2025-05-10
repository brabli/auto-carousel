import { AutoCarousel } from "../dist/index.mjs";

const wrapper = document.querySelector(".wrapper");

if (null === wrapper) {
    throw new Error("No .wrapper class was found.");
}

new AutoCarousel(wrapper, {
    speed: 1,
    gap: 32,
    direction: "left",
});
