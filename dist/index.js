"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, {
                    get: () => from[key],
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
                });
    }
    return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
    AutoCarousel: () => AutoCarousel,
});
module.exports = __toCommonJS(src_exports);
var AutoCarousel = class {
    /** Initial element. */
    element;
    /** Options this instance of AutoCarousel is using. */
    options;
    /** The element that holds the slides. */
    container;
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.container = getContainer(this);
        this.initialise();
    }
    initialise() {
        this.element.style.overflowX = "hidden";
        this.element.style.display = "flex";
        this.container.style.display = "flex";
        turnChildrenIntoSlides(this);
        const updateContainerSize = (container) => {
            let prevContainerWidth = 0;
            let numberOfTimesDoubled = 0;
            if (container.offsetWidth < window.innerWidth * 2) {
                this.debug(`
                    About to begin doubling container size.
                    Window inner width: ${window.innerWidth}
                    Container offset width: ${container.offsetWidth}
                `);
            } else {
                this.debug(`
                    No need to double container size, it's wide enough.
                    Window inner width: ${window.innerWidth}
                    Container offset width: ${container.offsetWidth}
                `);
            }
            while (container.offsetWidth < window.innerWidth * 2) {
                if (12 === numberOfTimesDoubled) {
                    throw new Error(
                        "Container has doubled in size 12 times and still hasn't reached the size it needs to be, aborting to avoid crashing.",
                    );
                }
                doubleContainerSize(container);
                numberOfTimesDoubled += 1;
                this.debug(`Doubled container ${numberOfTimesDoubled} time/s.`);
                const newContainerWidth = container.offsetWidth;
                if (newContainerWidth <= prevContainerWidth) {
                    throw new Error(
                        "[ERR] Something went wrong while doubling container elements; the container either stayed the same width or it shrunk somehow.",
                    );
                }
                prevContainerWidth = newContainerWidth;
            }
        };
        updateContainerSize(this.container);
        window.addEventListener("resize", () => updateContainerSize(this.container));
        if ("right" === this.options.direction) {
            const quarterWidth = this.container.offsetWidth / 4;
            this.container.style.marginLeft = `-${quarterWidth}px`;
        }
        let scrollPosition = 0;
        let lastTimestamp;
        function animateCarousel(timestamp, autoCarousel) {
            const delta = calculateDelta(timestamp, lastTimestamp);
            lastTimestamp = timestamp;
            const speed = calculateSpeed(autoCarousel.options.speed, delta);
            scrollPosition += speed;
            const slideToRemove = getSlideToRemove(autoCarousel);
            const childWidth = slideToRemove.offsetWidth;
            if (void 0 === childWidth) {
                throw new Error("Child element width is undefined.");
            }
            if (scrollPosition >= childWidth) {
                scrollPosition = 0;
                const clonedSlide = slideToRemove.cloneNode(true);
                if ("left" === autoCarousel.options.direction) {
                    autoCarousel.container.appendChild(clonedSlide);
                }
                if ("right" === autoCarousel.options.direction) {
                    autoCarousel.container.prepend(clonedSlide);
                }
                autoCarousel.container.removeChild(slideToRemove);
            }
            if ("left" === autoCarousel.options.direction) {
                autoCarousel.container.style.transform = `translateX(-${scrollPosition}px)`;
            }
            if ("right" === autoCarousel.options.direction) {
                autoCarousel.container.style.transform = `translateX(${scrollPosition}px)`;
            }
            requestAnimationFrame((timestamp2) => animateCarousel(timestamp2, autoCarousel));
        }
        requestAnimationFrame((timestamp) => animateCarousel(timestamp, this));
    }
    debug(message) {
        if (this.options.debug) {
            const sanitisedMessage = message.replace(/\n\s+/g, "\n").trim();
            console.info(sanitisedMessage);
        }
    }
};
function getContainer(autoCarousel) {
    const selector = autoCarousel.options.containerSelector;
    const container = autoCarousel.element.querySelector(selector);
    if (!(container instanceof HTMLElement)) {
        throw new Error(`No container element found with the selector "${selector}".`);
    }
    return container;
}
function turnChildrenIntoSlides(autoCarousel) {
    const children = autoCarousel.container.children;
    for (const child of children) {
        createSlide(child, autoCarousel.options);
    }
}
function calculateSpeed(speed, delta) {
    return speed * 0.05 * delta;
}
function calculateDelta(timestamp, lastTimestamp) {
    return timestamp - (lastTimestamp ?? timestamp);
}
function doubleContainerSize(container) {
    const numChildren = container.children.length;
    for (let i = 0; i < numChildren; i++) {
        const child = container.children[i];
        if (void 0 === child) {
            throw new Error(`A child element within the container was undefined at index ${i}.`);
        }
        container.appendChild(child.cloneNode(true));
    }
}
function wrapInDiv(elementToWrap) {
    const div = document.createElement("div");
    elementToWrap.parentNode?.insertBefore(div, elementToWrap);
    div.appendChild(elementToWrap);
    return div;
}
function createSlide(element, options) {
    const slide = wrapInDiv(element);
    slide.style.minWidth = "max-content";
    slide.style.paddingRight = `${options.gap}px`;
    return slide;
}
function getSlideToRemoveIndex(autoCarousel) {
    const direction = autoCarousel.options.direction;
    switch (direction) {
        case "left":
            return 0;
        case "right":
            return autoCarousel.container.children.length - 1;
        default:
            throw new Error(`Invalid direction in options "${direction}".`);
    }
}
function getSlideToRemove(autoCarousel) {
    const slideToRemoveIndex = getSlideToRemoveIndex(autoCarousel);
    const slideToRemove = autoCarousel.container.children[slideToRemoveIndex];
    if (void 0 === slideToRemove) {
        throw new Error(
            `Expected to find a slide to remove at index ${slideToRemoveIndex}, however none was found.`,
        );
    }
    return slideToRemove;
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
    (module.exports = {
        AutoCarousel,
    });
