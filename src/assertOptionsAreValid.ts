import type { AutoCarouselOptions } from ".";

/**
 * Throws an error on receiving an invalid option.
 */
export function assertOptionsAreValid(options: AutoCarouselOptions): void {
    validateAlign(options.align);
    validateDebug(options.debug);
    validateDirection(options.direction);
    validateGap(options.gap);
    validateSpeed(options.speed);
    validateStopOnHover(options.stopOnHover);
}

function validateAlign(align: unknown): void {
    if (typeof align !== "string") {
        throw new Error("Option `align` must be of type `string`.");
    }

    const isValidAlignment =
        align === "top" || align === "middle" || align === "bottom" || align === "stretch";

    if (!isValidAlignment) {
        throw new Error("Option `align` must be one of `top`, `middle`, `bottom` or `stretch`.");
    }
}

function validateDebug(debug: unknown): void {
    const isValid = debug === true || debug === false;

    if (!isValid) {
        throw new Error("Option `debug` must be of type `boolean`.");
    }
}

function validateDirection(direction: unknown): void {
    if (typeof direction !== "string") {
        throw new Error("Option `direction` must be of type `string`.");
    }

    const isValidDirection = direction === "left" || direction === "right";

    if (!isValidDirection) {
        throw new Error("Option `direction` must be one of `left` or `right`.");
    }
}

function validateGap(gap: unknown): void {
    if (typeof gap !== "number" || Number.isNaN(gap)) {
        throw new Error("Option `gap` must be of type `number`.");
    }

    if (gap < 0) {
        throw new Error("Option `gap` must be a non-negative number.");
    }
}

function validateSpeed(speed: unknown): void {
    if (typeof speed !== "number" || Number.isNaN(speed)) {
        throw new Error("Option `speed` must be of type `number`.");
    }

    if (speed < 0) {
        throw new Error("Option `speed` must be a non-negative number.");
    }
}

function validateStopOnHover(stopOnHover: unknown): void {
    const isValid = stopOnHover === true || stopOnHover === false;

    if (!isValid) {
        throw new Error("Option `stopOnHover` must be of type `boolean`.");
    }
}
