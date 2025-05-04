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
        throw new Error("No container!");
    }

    container.style.display = 'flex';
    const slides = container.querySelectorAll('.slide');

    console.log("slides:");
    console.log(slides);
    slides.forEach((slide) => {
        if (!(slide instanceof HTMLElement)) {
            throw new Error;
        }

        slide.style.minWidth = 'max-content';
        slide.style.paddingLeft = `${options.gap}px`;
        slide.style.paddingRight = `${options.gap}px`;
        console.log(slide.style.paddingLeft);
    });


    const updateContainerSize = () => {
        let i = 0;
        while (container.offsetWidth < window.innerWidth) {
            console.log("Container offset width: " + container.offsetWidth);
            console.log("Container client width: " + container.clientWidth);
            console.log("Container children: " + container.children.length);
            console.log("Window width: " + window.innerWidth);
            doubleContainerSize(container);
            i++;
            if (i > 8) {
                console.warn(`Broke off loop early. Elmt no: ${container.children.length}`);
                break;
            }
        }
    };

    window.addEventListener('resize', updateContainerSize);

    updateContainerSize();


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

