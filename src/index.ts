type Container = HTMLElement;
type Slide = HTMLElement;

type Direction = "left" | "right";

type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
    debug: boolean;
};

export class AutoCarousel {
    private element: HTMLElement;
    private options: AutoCarouselOptions;

    constructor(element: HTMLElement, options: AutoCarouselOptions) {
        this.element = element;
        this.options = options;

        this.initialise(this.element, this.options);
    }

    private initialise(element: HTMLElement, options: AutoCarouselOptions): void {
        element.style.overflowX = "hidden";
        element.style.display = "flex";

        const container = getContainer(this.element);
        container.style.display = "flex";

        turnChildrenIntoSlides(container, this.options);

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
                doubleContainerSize(container);
                numberOfTimesDoubled += 1;

                this.debug(`Doubled container ${numberOfTimesDoubled} time/s.`);

                const newContainerWidth = container.offsetWidth;

                if (newContainerWidth <= prevContainerWidth) {
                    throw new Error(
                        "Something went wrong while increasing container size, the container either stayed the same width or it shrunk somehow.",
                    );
                }

                prevContainerWidth = newContainerWidth;
            }
        };

        window.addEventListener("resize", () => updateContainerSize(container));

        updateContainerSize(container);

        // Move container left a bit to hide elements appearing on the left
        if ("right" === this.options.direction) {
            const quarterWidth = container.offsetWidth / 4;
            container.style.marginLeft = `-${quarterWidth}px`;
        }

        let scrollPosition = 0;
        let lastTimestamp: number | undefined;

        function animateCarousel(timestamp: number, options: AutoCarouselOptions) {
            const delta = calculateDelta(timestamp, lastTimestamp);

            if (!(container instanceof HTMLElement)) {
                throw new Error("No container, shame!!");
            }

            lastTimestamp = timestamp;

            const speed = calculateSpeed(options.speed, delta);
            scrollPosition += speed;

            let childWidth = undefined;

            if ("left" === options.direction) {
                const firstChild = getFirstChild(container);
                childWidth = firstChild.offsetWidth;
            }

            if ("right" === options.direction) {
                const lastChild = getLastChild(container);
                childWidth = lastChild.offsetWidth;
            }

            if (undefined === childWidth) {
                throw new Error("Child element width is undefined.");
            }

            if (scrollPosition >= childWidth) {
                scrollPosition = 0;

                if ("left" === options.direction) {
                    const index = 0;

                    const child = container.children[index];
                    if (undefined === child) {
                        throw new Error();
                    }
                    container.appendChild(child.cloneNode(true));
                    container.removeChild(child);
                }

                if ("right" === options.direction) {
                    const index = container.children.length - 1;
                    const lastChild = container.children[index];
                    if (undefined === lastChild) {
                        throw new Error();
                    }
                    container.prepend(lastChild.cloneNode(true));

                    const newLastChild = container.children[index + 1];
                    if (undefined === newLastChild) {
                        throw new Error();
                    }
                    container.removeChild(newLastChild);
                }
            }

            if ("left" === options.direction) {
                container.style.transform = `translateX(-${scrollPosition}px)`;
            }

            if ("right" === options.direction) {
                container.style.transform = `translateX(${scrollPosition}px)`;
            }

            requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, options));
        }

        requestAnimationFrame((timestamp: number) => animateCarousel(timestamp, options));
    }

    private debug(message: string): void {
        if (this.options.debug) {
            const sanitisedMessage = message.replace(/\n\s+/g, "\n").trim();
            console.info(sanitisedMessage);
        }
    }
}

function getContainer(element: HTMLElement): Container {
    const container = element.querySelector(".container");
    assert(container instanceof HTMLElement, "[ERR] Could not find a container element.");

    return container;
}

function turnChildrenIntoSlides(container: Container, opts: AutoCarouselOptions): void {
    const children = container.children;

    for (const child of children) {
        createSlide(child, opts);
    }
}

function calculateSpeed(speed: number, delta: number): number {
    return speed * 0.05 * delta;
}

function calculateDelta(timestamp: number, lastTimestamp: number | undefined): number {
    return timestamp - (lastTimestamp ?? timestamp);
}

function getFirstChild(element: Container): HTMLElement {
    const firstChild = element.children[0];

    if (!firstChild) {
        throw new Error("Infinite scroll container has no child at index 0!");
    }

    return firstChild as HTMLElement;
}

function getLastChild(element: Container): HTMLElement {
    const index = element.children.length - 1;
    const lastChild = element.children[index];

    if (!lastChild) {
        throw new Error(`Infinite scroll container has no child at index ${index}!`);
    }

    return lastChild as HTMLElement;
}

function doubleContainerSize(container: Container): void {
    const numChildren = container.children.length;

    for (let i = 0; i < numChildren; i++) {
        const child = container.children[i];
        assert(
            undefined !== child,
            `A child element within the container was undefined at index ${i}.`,
        );
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

function assert(statement: boolean, errorMessage: string): asserts statement {
    if (!statement) {
        throw new Error(`[ERR] ${errorMessage}`);
    }
}
