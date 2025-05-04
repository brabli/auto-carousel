type Container = HTMLElement;
type Direction = 'left' | 'right';
type AutoCarouselOptions = {
    speed: number,
    gap: number,
    direction: Direction,
}

export function createAutoCarousel(wrapper: HTMLElement, options: AutoCarouselOptions): void {
    wrapper.style.overflowX = 'hidden';
    wrapper.style.display = 'flex';

    const container = wrapper.querySelector('.container');

    if (!(container instanceof HTMLElement)) {
        throw new Error("No `.container` element found.");
    }

    container.style.display = 'flex';
    const children = container.children;

    Array.from(children).forEach((child) => {
        if (!(child instanceof HTMLElement)) {
            throw new Error;
        }

        const slide = wrapInDiv(child);
        slide.style.minWidth = 'max-content';
        slide.style.paddingRight = `${options.gap}px`;
    });


    const updateContainerSize = (container: HTMLElement) => {
        let prevContainerWidth = 0;

        while (container.offsetWidth < window.innerWidth) {
            doubleContainerSize(container);

            const newContainerWidth = container.offsetWidth;

            if (newContainerWidth <= prevContainerWidth) {
                throw new Error("Something went wrong while increasing container size, the container either stayed the same width or it shrunk somehow.");
            }

            prevContainerWidth = newContainerWidth;
        }
    };

    window.addEventListener('resize', () => updateContainerSize(container));

    updateContainerSize(container);


    if ('right' === options.direction) {
        // Move containers left a bit to hide elements appearing on the left
        const quarterWidth = container.offsetWidth / 4;
        container.style.marginLeft = `-${quarterWidth}px`;
    }

    let scrollPosition = 0;
    let lastTimestamp: number | undefined;

    function animateCarousel(timestamp: number) {
        const delta = calculateDelta(timestamp, lastTimestamp);

        if (!(container instanceof HTMLElement)) {
            throw new Error("No container, shame!!");
        }

        lastTimestamp = timestamp;


        const speed = calculateSpeed(options.speed, delta);
        scrollPosition += speed;

        let childWidth;

        if ('left' === options.direction) {
            const firstChild = getFirstChild(container);
            childWidth = firstChild.offsetWidth;
        }

        if ('right' === options.direction) {
            const lastChild = getLastChild(container);
            childWidth = lastChild.offsetWidth;
        }

        if (undefined === childWidth) {
            throw new Error('Child element width is undefined.');
        }

        if (scrollPosition >= childWidth) {
            scrollPosition = 0;

            if ('left' === options.direction) {
                const index = 0;

                const child = container.children[index];
                if (undefined === child) {
                    throw new Error();
                }
                container.appendChild(child.cloneNode(true));
                container.removeChild(child);
            }

            if ('right' === options.direction) {
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

        if ('left' === options.direction) {
            container.style.transform = `translateX(-${scrollPosition}px)`;
        }

        if ('right' === options.direction) {
            container.style.transform = `translateX(${scrollPosition}px)`;
        }

        requestAnimationFrame(animateCarousel);
    }

    requestAnimationFrame(animateCarousel);

}

function calculateSpeed(speed: number, delta: number): number {
    return speed * 0.05 * delta;
}

function calculateDelta(
    timestamp: number,
    lastTimestamp: number | undefined
): number {
    return timestamp - (lastTimestamp ?? timestamp);
}

function getFirstChild(element: Container): HTMLElement {
    const firstChild = element.children[0];

    if (!firstChild) {
        throw new Error('Infinite scroll container has no child at index 0!');
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

function doubleContainerSize(element: Container): void {
    const len = element.children.length;
    for (let i = 0; i < len; i++) {
        const child = element.children[i];
        if (undefined === child) {
            throw new Error();
        }
        element.appendChild(child.cloneNode(true));
    }
}

function wrapInDiv(elementToWrap: HTMLElement): HTMLElement {
    const div = document.createElement('div');
    elementToWrap.parentNode?.insertBefore(div, elementToWrap);
    div.appendChild(elementToWrap);

    return div;
}

