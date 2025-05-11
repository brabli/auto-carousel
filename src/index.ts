type Container = HTMLElement;
type Slide = HTMLElement;
type Direction = "left" | "right";

type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
    debug: boolean;
    containerSelector: string;
};

export class AutoCarousel {
    /** Initial element. */
    public element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    public options: AutoCarouselOptions;
    /** The element that holds the slides. */
    public container: Container;
    /** Original slide elements before any doubling occurs. */
    public slides: Slide[];

    constructor(element: HTMLElement, options: AutoCarouselOptions) {
        this.element = element;
        this.options = options;
        this.container = getContainer(this);
        this.slides = turnChildrenIntoSlides(this);

        this.initialise();
    }

    private initialise(): void {
        // Set initial required styles
        this.element.style.overflowX = "hidden";
        this.element.style.display = "flex";
        this.container.style.display = "flex";

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

        let scrollPosition = 0;
        let lastTimestamp: number | undefined;

        function animateCarousel(timestamp: number, autoCarousel: AutoCarousel): void {
            const delta = calculateDelta(timestamp, lastTimestamp);

            lastTimestamp = timestamp;

            const speed = calculateSpeed(autoCarousel.options.speed, delta);
            scrollPosition += speed;

            const slideToRemove = getSlideToRemove(autoCarousel);
            const childWidth = slideToRemove.offsetWidth;

            if (undefined === childWidth) {
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

            requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, autoCarousel));
        }

        requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, this));
    }

    private debug(message: string): void {
        if (this.options.debug) {
            const sanitisedMessage = message.replace(/\n\s+/g, "\n").trim();
            console.info(sanitisedMessage);
        }
    }
}

function getContainer(autoCarousel: AutoCarousel): Container {
    const selector = autoCarousel.options.containerSelector;
    const container = autoCarousel.element.querySelector(selector);

    if (!(container instanceof HTMLElement)) {
        throw new Error(`No container element found with the selector "${selector}".`);
    }

    return container;
}

function turnChildrenIntoSlides(autoCarousel: AutoCarousel): Slide[] {
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

function wrapInDiv(elementToWrap: Element): Slide {
    const div = document.createElement("div");
    elementToWrap.parentNode?.insertBefore(div, elementToWrap);
    div.appendChild(elementToWrap);

    return div;
}

function createSlide(element: Element, options: AutoCarouselOptions): Slide {
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
