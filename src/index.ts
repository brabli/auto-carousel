import { debug } from "console";

/**
 * User specified options for AutoCarousel.
 */
export type AutoCarouselUserOptions = Partial<AutoCarouselOptions>;

interface AutoCarouselOptions {
    align: "top" | "middle" | "bottom";
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
        this.container = createContainer(this);

        createSlides(this);

        this.initialise();
    }

    private initialise(): void {
        // Set initial required styles
        this.element.style.overflowX = "hidden";
        this.element.style.display = "flex";

        if (0 === this.element.children.length) {
            throw new Error("Provided element must have at least one child element, it has none.");
        }

        const updateContainerSize = (container: Container) => {
            const originalContainerWidth = container.offsetWidth;
            const requiredMinimumWidth = window.innerWidth * 2;
            const numberOfTimesToDouble = Math.ceil(
                Math.max(0, Math.log2(requiredMinimumWidth / originalContainerWidth)),
            );

            this.debug(
                `Need to double ${numberOfTimesToDouble} time${s(numberOfTimesToDouble)} to reach required container width.`,
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
                        "Something went wrong while doubling container elements; the container either stayed the same width or it shrunk somehow.",
                    );
                }

                prevContainerWidth = newContainerWidth;
            }
        };

        updateContainerSize(this.container);

        window.addEventListener("resize", () => updateContainerSize(this.container));

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

            // Apparently using translate3d instead of translateX makes the browser "more likely" to use the GPU,
            // don't quote me on that though...
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
            console.info(sanitisedMessage);
        }
    }
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
