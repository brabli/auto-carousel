// src/index.ts
var defaultOptions = {
  debug: false,
  direction: "left",
  gap: 32,
  speed: 1
};
var AutoCarousel = class {
  /** Initial wrapper element. */
  element;
  /** Options this instance of AutoCarousel is using. */
  options;
  /** The element that hoAutoCarouselOptionslds the slides. */
  container;
  /** Original slide elements before any doubling occurs. */
  slides;
  constructor(element, options = {}) {
    this.element = element;
    this.options = mergeWithDefaultOptions(options);
    this.container = createContainer(this);
    this.slides = createSlides(this);
    this.initialise();
  }
  initialise() {
    this.element.style.overflowX = "hidden";
    this.element.style.display = "flex";
    const updateContainerSize = (container) => {
      const originalContainerWidth = container.offsetWidth;
      const requiredMinimumWidth = window.innerWidth * 2;
      const numberOfTimesToDouble = Math.ceil(
        Math.max(0, Math.log2(requiredMinimumWidth / originalContainerWidth))
      );
      this.debug(
        `Need to double ${numberOfTimesToDouble} time${s(numberOfTimesToDouble)} to reach required container width.`
      );
      if (numberOfTimesToDouble > 0) {
        this.debug("About to begin doubling container size.");
      } else {
        this.debug(`No need to double container size, it's wide enough.`);
      }
      this.debug(`
                Window inner width: ${window.innerWidth}
                Container offset width: ${container.offsetWidth}
            `);
      let prevContainerWidth = 0;
      for (let i = 0; i < numberOfTimesToDouble; i++) {
        doubleContainerSize(container);
        const newContainerWidth = container.offsetWidth;
        if (newContainerWidth <= prevContainerWidth) {
          throw new Error(
            "Something went wrong while doubling container elements; the container either stayed the same width or it shrunk somehow."
          );
        }
        prevContainerWidth = newContainerWidth;
      }
    };
    updateContainerSize(this.container);
    window.addEventListener("resize", () => updateContainerSize(this.container));
    if ("right" === this.options.direction) {
      const quarterWidth = this.container.offsetWidth / 2;
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
function mergeWithDefaultOptions(userOptions) {
  const mergedOptions = { ...userOptions, ...defaultOptions };
  return mergedOptions;
}
function createContainer(autoCarousel) {
  const element = autoCarousel.element;
  const container = document.createElement("div");
  while (element.firstChild) {
    container.appendChild(element.firstChild);
  }
  element.appendChild(container);
  container.style.display = "flex";
  return container;
}
function createSlides(autoCarousel) {
  const children = autoCarousel.container.children;
  const slides = [];
  for (const child of children) {
    slides.push(createSlide(child, autoCarousel.options));
  }
  return slides;
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
      `Expected to find a slide to remove at index ${slideToRemoveIndex}, however none was found.`
    );
  }
  return slideToRemove;
}
function s(n) {
  return n === 1 ? "" : "s";
}
export {
  AutoCarousel
};
