type AutoCarouselUserOptions = Partial<AutoCarouselOptions>;
interface AutoCarouselOptions {
    align: "top" | "middle" | "bottom";
    debug: boolean;
    direction: "left" | "right";
    gap: number;
    speed: number;
    stopOnHover: boolean;
}
type Container = HTMLElement;
type Slide = HTMLElement;
declare class AutoCarousel {
    /** Initial wrapper element. */
    element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    options: AutoCarouselOptions;
    /** The created element that holds the slides. */
    container: Container;
    /** Original slide elements before any doubling occurs. */
    slides: Slide[];
    private hover;
    constructor(element: HTMLElement, options?: AutoCarouselUserOptions);
    private initialise;
    /**
     * Print a message to the console if the `debug` option is enabled.
     */
    private debug;
}

export { AutoCarousel, type AutoCarouselUserOptions };
