type Direction = "left" | "right";
type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
    debug: boolean;
};
declare class AutoCarousel {
    private element;
    private options;
    constructor(element: HTMLElement, options: AutoCarouselOptions);
    private initialise;
    private debug;
}

export { AutoCarousel };
