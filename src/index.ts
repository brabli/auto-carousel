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

    constructor(element: HTMLElement, options: AutoCarouselOptions) {
        this.element = element;
        this.options = options;
        this.container = getContainer(this);

        this.initialise();
    }

    private initialise(): void {
        // Set initial required styles
        this.element.style.overflowX = "hidden";
        this.element.style.display = "flex";
        this.container.style.display = "flex";

        turnChildrenIntoSlides(this);

        const updateContainerSize = (container: Container) => {
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
                // If the container has to double in length more than 12 times, something is wrong
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

        // Move container left a bit to hide elements appearing on the left
        if ("right" === this.options.direction) {
            const quarterWidth = this.container.offsetWidth / 4;
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

function turnChildrenIntoSlides(autoCarousel: AutoCarousel): void {
    const children = autoCarousel.container.children;

    for (const child of children) {
        createSlide(child, autoCarousel.options);
    }
}

function calculateSpeed(speed: number, delta: number): number {
    return speed * 0.05 * delta;
}

function calculateDelta(timestamp: number, lastTimestamp: number | undefined): number {
    return timestamp - (lastTimestamp ?? timestamp);
}

function getFirstSlide(element: Container): Slide {
    const firstSlide = element.children[0];

    if (!(firstSlide instanceof HTMLElement)) {
        throw new Error("Container has no slide at index 0.");
    }

    return firstSlide;
}

function getLastSlide(element: Container): Slide {
    const index = element.children.length - 1;
    const lastSlide = element.children[index];

    if (!(lastSlide instanceof HTMLElement)) {
        throw new Error(`Container has no child at index ${index}.`);
    }

    return lastSlide;
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
