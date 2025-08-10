/**
 * User specified options for AutoCarousel.
 */
export type AutoCarouselUserOptions = Partial<AutoCarouselOptions>;

interface AutoCarouselOptions {
    align: "top" | "middle" | "bottom" | "stretch";
    debug: boolean;
    direction: "left" | "right";
    gap: number;
    speed: number;
    stopOnHover: boolean;
}

const defaultOptions: AutoCarouselOptions = {
    align: "middle",
    debug: false,
    direction: "left",
    gap: 32,
    speed: 1,
    stopOnHover: false,
};

type Container = HTMLElement;
type Slide = HTMLElement;

/**
 * Create an automatic carousel from an element and it's children.
 */
export class AutoCarousel {
    /** Initial element. */
    public element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    public options: AutoCarouselOptions;
    /** The created container element that holds the slides. */
    public container: Container;

    private hover = false;

    /**
     * @param {HTMLElement|string} element An HTML element or a CSS selector string
     * @param {AutoCarouselUserOptions} options User specified options
     */
    constructor(element: HTMLElement | string, options: AutoCarouselUserOptions = {}) {
        this.options = mergeWithDefaultOptions(options);

        if (typeof element === "string") {
            this.debug(`Provided selector: ${element}`);
        }

        this.element = resolveElement(element);
        // Set initial required styles early to prevent vertical content stacks while things load
        this.element.style.display = "flex";
        this.element.style.overflowX = "hidden";

        this.container = createContainer(this);
        createSlides(this);

        // If images exist, wait for them to load first so we can properly determine
        // the width of the container.
        if (hasImages(this.container)) {
            const images = getImages(this.container);
            this.debug(
                `Waiting for ${images.length} image${s(images.length)} to load before continuing initialisation.`,
            );
            waitForImagesToLoad(images, () => this.initialise());
        } else {
            this.initialise();
        }
    }

    private initialise(): void {
        if (0 === this.element.children.length) {
            throw new Error("Provided element must have at least one child element, it has none.");
        }

        const slides = getSlides(this.container);
        const largestSlideWidth = findLargestSlideWidth(slides);

        if (largestSlideWidth > window.innerWidth) {
            this.debug(
                `A slide is ${largestSlideWidth}px, which is wider than the window (${window.innerWidth}px). Doubling container once to compensate.`,
            );
            doubleContainerSize(this.container);
        }

        function findLargestSlideWidth(slides: Slide[]): number {
            return Math.max(...slides.map((slide) => slide.offsetWidth));
        }

        const updateContainerSize = (container: Container) => {
            const originalContainerWidth = container.offsetWidth;
            const requiredMinimumWidth = window.innerWidth * 2;
            const numberOfTimesToDouble = Math.ceil(
                Math.max(0, Math.log2(requiredMinimumWidth / originalContainerWidth)),
            );

            if (numberOfTimesToDouble > 0) {
                this.debug(`
                    The window's width is ${window.innerWidth}px.
                    The container's width is ${container.offsetWidth}px.
                    Need to double number of slides ${numberOfTimesToDouble} time${s(numberOfTimesToDouble)} to reach required container width of ${requiredMinimumWidth}px.`);
            } else {
                this.debug(`No need to increase container size, it's wide enough.`);
                return;
            }

            let prevContainerWidth = 0;

            for (let i = 0; i < numberOfTimesToDouble; i++) {
                const numberOfSlides = container.children.length;

                if (numberOfSlides > 1000) {
                    throw new Error(
                        "The number of slides is over 1000. This was probably not meant to happen, so auto-carousel has crashed to try save the browser itself from crashing. A noble sacrifice.",
                    );
                }

                doubleContainerSize(container);

                const newContainerWidth = container.offsetWidth;

                if (newContainerWidth <= prevContainerWidth) {
                    throw new Error(
                        `Something went wrong while doubling container elements; the container either stayed the same width or it shrunk somehow.\nNumber of slides: ${container.children.length}\nPrevious width:   ${prevContainerWidth}px\nNew width:        ${newContainerWidth}px\n`,
                    );
                }

                prevContainerWidth = newContainerWidth;
            }
        };

        updateContainerSize(this.container);

        const resizeObserver = new ResizeObserver(() => updateContainerSize(this.container));
        resizeObserver.observe(this.element);

        // Move container left a bit to hide elements appearing on the left
        if ("right" === this.options.direction) {
            const quarterWidth = this.container.offsetWidth / 2;
            this.container.style.marginLeft = `-${quarterWidth}px`;
        }

        if (this.options.stopOnHover) {
            this.container.addEventListener("mouseover", () => {
                this.hover = true;
                this.container.style.willChange = "auto";
            });

            this.container.addEventListener("mouseout", () => {
                this.hover = false;
                this.container.style.willChange = "transform";
            });
        }

        let scrollPosition = 0;
        let lastTimestamp: number | undefined;
        let slideToRemove = getSlideToRemove(this);
        let childWidth = slideToRemove.offsetWidth;

        function animateCarousel(timestamp: number, autoCarousel: AutoCarousel): void {
            if (autoCarousel.hover) {
                lastTimestamp = undefined; // Animation jumps on mouseout if timestamp is not reset

                setTimeout(() => {
                    requestAnimationFrame((timestamp: number) =>
                        animateCarousel(timestamp, autoCarousel),
                    );
                }, 100); // Check every 100ms whether to resume or not
                return;
            }

            const delta = calculateDelta(timestamp, lastTimestamp);

            lastTimestamp = timestamp;

            const speed = calculateSpeed(autoCarousel.options.speed, delta);
            scrollPosition += speed;

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

                slideToRemove = getSlideToRemove(autoCarousel);
                childWidth = slideToRemove.offsetWidth;
            }

            // Apparently, using translate3d instead of translateX makes the browser "more likely" to use the GPU,
            // Don't quote me on that though...
            if ("left" === autoCarousel.options.direction) {
                autoCarousel.container.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
            }

            if ("right" === autoCarousel.options.direction) {
                autoCarousel.container.style.transform = `translate3d(${scrollPosition}px, 0, 0)`;
            }

            requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, autoCarousel));
        }

        requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, this));
    }

    /**
     * Print a message to the console if the `debug` option is enabled.
     */
    private debug(message: string): void {
        if (this.options.debug) {
            const sanitisedMessage = message.replace(/\n\s+/g, "\n").trim();
            console.info(`[AUTO-CAROUSEL DEBUG]\n${sanitisedMessage}`);
        }
    }
}

/** Wait for images to load, then run the callback on success. */
function waitForImagesToLoad(images: HTMLImageElement[], callback: () => void): void {
    const loadingImages = images.map((i) => i.decode());

    Promise.all(loadingImages)
        .then(callback)
        .catch((reason: Error) => {
            console.error(
                `Failed to start auto-carousel because an image failed to load.\nMessage: ${reason.message}`,
            );
        });
}

function hasImages(container: Container): boolean {
    return null !== container.querySelector("img");
}

function getImages(container: Container): HTMLImageElement[] {
    return Array.from(container.querySelectorAll("img"));
}

function mergeWithDefaultOptions(userOptions: AutoCarouselUserOptions): AutoCarouselOptions {
    const mergedOptions = { ...defaultOptions, ...userOptions };

    return mergedOptions;
}

function resolveElement(element: HTMLElement | string): HTMLElement {
    if (element instanceof HTMLElement) {
        return element;
    }

    const foundElement = document.querySelector(element);

    if (!(foundElement instanceof HTMLElement)) {
        throw new Error(`No element found using the CSS selector "${element}".`);
    }

    return foundElement;
}

function createContainer(autoCarousel: AutoCarousel): Container {
    const element = autoCarousel.element;
    const container = document.createElement("div");

    while (element.firstChild) {
        container.appendChild(element.firstChild);
    }

    element.appendChild(container);
    container.style.display = "flex";
    container.style.willChange = "transform"; // Optimisation

    switch (autoCarousel.options.align) {
        case "top":
            container.style.alignItems = "flex-start";
            break;
        case "middle":
            container.style.alignItems = "center";
            break;
        case "bottom":
            container.style.alignItems = "flex-end";
            break;
        case "stretch":
            container.style.alignItems = "stretch";
            break;
    }

    return container;
}

function createSlides(autoCarousel: AutoCarousel): Slide[] {
    const children = autoCarousel.container.children;
    const slides = [];

    for (const child of children) {
        slides.push(createSlide(child, autoCarousel.options));
    }

    return slides;
}

function calculateSpeed(speed: number, delta: number): number {
    return speed * 0.05 * delta;
}

function calculateDelta(timestamp: number, lastTimestamp: number | undefined): number {
    return timestamp - (lastTimestamp ?? timestamp);
}

function doubleContainerSize(container: Container): void {
    const numChildren = container.children.length;

    for (let i = 0; i < numChildren; i++) {
        const child = container.children[i];

        if (undefined === child) {
            throw new Error(`A child element within the container was undefined at index ${i}.`);
        }

        container.appendChild(child.cloneNode(true));
    }
}

function wrapInDiv(elementToWrap: Element): HTMLDivElement {
    const div = document.createElement("div");
    elementToWrap.parentNode?.insertBefore(div, elementToWrap);
    div.appendChild(elementToWrap);

    return div;
}

function createSlide(element: Element, options: AutoCarouselUserOptions): Slide {
    const slide = wrapInDiv(element);
    slide.style.minWidth = "max-content";
    slide.style.paddingRight = `${options.gap}px`;

    return slide;
}

function getSlideToRemoveIndex(autoCarousel: AutoCarousel): number {
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

function getSlideToRemove(autoCarousel: AutoCarousel): Slide {
    const slideToRemoveIndex = getSlideToRemoveIndex(autoCarousel);
    const slideToRemove = autoCarousel.container.children[slideToRemoveIndex];

    if (undefined === slideToRemove) {
        throw new Error(
            `Expected to find a slide to remove at index ${slideToRemoveIndex}, however none was found.`,
        );
    }

    return slideToRemove as Slide;
}

function s(n: number): string {
    return n === 1 ? "" : "s";
}

function getSlides(container: Container): Slide[] {
    return Array.from(container.children) as Slide[];
}
