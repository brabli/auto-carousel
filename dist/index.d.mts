/**
 * User specified options for AutoCarousel.
 */
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
/**
 * Create an automatic carousel from an element and it's children.
 */
declare class AutoCarousel {
    /** Initial element. */
    element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    options: AutoCarouselOptions;
    /** The created container element that holds the slides. */
    container: Container;
    private hover;
    constructor(element: HTMLElement, options?: AutoCarouselUserOptions);
    private initialise;
    /**
     * Print a message to the console if the `debug` option is enabled.
     */
    private debug;
}

export { AutoCarousel, type AutoCarouselUserOptions };
