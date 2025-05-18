type Container = HTMLElement;
type Slide = HTMLElement;
type Direction = "left" | "right";
type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
    debug: boolean;
};
declare class AutoCarousel {
    /** Initial wrapper element. */
    element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    options: AutoCarouselOptions;
    /** The element that holds the slides. */
    container: Container;
    /** Original slide elements before any doubling occurs. */
    slides: Slide[];
    constructor(element: HTMLElement, options: AutoCarouselOptions);
    private initialise;
    private debug;
}

export { AutoCarousel, type AutoCarouselOptions };
