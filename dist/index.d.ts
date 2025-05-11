type Container = HTMLElement;
type Direction = "left" | "right";
type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
    debug: boolean;
    containerSelector: string;
};
declare class AutoCarousel {
    /** Initial element. */
    element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    options: AutoCarouselOptions;
    /** The element that holds the slides. */
    container: Container;
    constructor(element: HTMLElement, options: AutoCarouselOptions);
    private initialise;
    private debug;
}

export { AutoCarousel };
