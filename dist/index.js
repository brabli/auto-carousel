"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AutoCarousel: () => AutoCarousel
});
module.exports = __toCommonJS(src_exports);
var AutoCarousel = class {
  element;
  options;
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.initialise(this.element, this.options);
  }
  initialise(element, options) {
    element.style.overflowX = "hidden";
    element.style.display = "flex";
    const container = getContainer(this.element);
    container.style.display = "flex";
    turnChildrenIntoSlides(container, this.options);
    const updateContainerSize = (container2) => {
      let prevContainerWidth = 0;
      while (container2.offsetWidth < window.innerWidth) {
        doubleContainerSize(container2);
        const newContainerWidth = container2.offsetWidth;
        if (newContainerWidth <= prevContainerWidth) {
          throw new Error("Something went wrong while increasing container size, the container either stayed the same width or it shrunk somehow.");
        }
        prevContainerWidth = newContainerWidth;
      }
    };
    window.addEventListener("resize", () => updateContainerSize(container));
    updateContainerSize(container);
    if ("right" === this.options.direction) {
      const quarterWidth = container.offsetWidth / 4;
      container.style.marginLeft = `-${quarterWidth}px`;
    }
    let scrollPosition = 0;
    let lastTimestamp;
    function animateCarousel(timestamp, options2) {
      const delta = calculateDelta(timestamp, lastTimestamp);
      if (!(container instanceof HTMLElement)) {
        throw new Error("No container, shame!!");
      }
      lastTimestamp = timestamp;
      const speed = calculateSpeed(options2.speed, delta);
      scrollPosition += speed;
      let childWidth;
      if ("left" === options2.direction) {
        const firstChild = getFirstChild(container);
        childWidth = firstChild.offsetWidth;
      }
      if ("right" === options2.direction) {
        const lastChild = getLastChild(container);
        childWidth = lastChild.offsetWidth;
      }
      if (void 0 === childWidth) {
        throw new Error("Child element width is undefined.");
      }
      if (scrollPosition >= childWidth) {
        scrollPosition = 0;
        if ("left" === options2.direction) {
          const index = 0;
          const child = container.children[index];
          if (void 0 === child) {
            throw new Error();
          }
          container.appendChild(child.cloneNode(true));
          container.removeChild(child);
        }
        if ("right" === options2.direction) {
          const index = container.children.length - 1;
          const lastChild = container.children[index];
          if (void 0 === lastChild) {
            throw new Error();
          }
          container.prepend(lastChild.cloneNode(true));
          const newLastChild = container.children[index + 1];
          if (void 0 === newLastChild) {
            throw new Error();
          }
          container.removeChild(newLastChild);
        }
      }
      if ("left" === options2.direction) {
        container.style.transform = `translateX(-${scrollPosition}px)`;
      }
      if ("right" === options2.direction) {
        container.style.transform = `translateX(${scrollPosition}px)`;
      }
      requestAnimationFrame((timestamp2) => animateCarousel(timestamp2, options2));
    }
    requestAnimationFrame((timestamp) => animateCarousel(timestamp, options));
  }
};
function getContainer(element) {
  const container = element.querySelector(".container");
  assert(container instanceof HTMLElement, "[ERR] Could not find a container element.");
  return container;
}
function turnChildrenIntoSlides(container, opts) {
  const children = container.children;
  Array.from(children).forEach((child) => {
    createSlide(child, opts);
  });
}
function calculateSpeed(speed, delta) {
  return speed * 0.05 * delta;
}
function calculateDelta(timestamp, lastTimestamp) {
  return timestamp - (lastTimestamp ?? timestamp);
}
function getFirstChild(element) {
  const firstChild = element.children[0];
  if (!firstChild) {
    throw new Error("Infinite scroll container has no child at index 0!");
  }
  return firstChild;
}
function getLastChild(element) {
  const index = element.children.length - 1;
  const lastChild = element.children[index];
  if (!lastChild) {
    throw new Error(`Infinite scroll container has no child at index ${index}!`);
  }
  return lastChild;
}
function doubleContainerSize(container) {
  const numChildren = container.children.length;
  for (let i = 0; i < numChildren; i++) {
    const child = container.children[i];
    assert(void 0 !== child, `A child element within the container was undefined at index ${i}.`);
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
function assert(statement, errorMessage) {
  if (!statement) {
    throw new Error(`[ERR] ${errorMessage}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutoCarousel
});
