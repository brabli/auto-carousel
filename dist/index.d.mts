type AutoCarouselUserOptions = Partial<AutoCarouselOptions>;
interface AutoCarouselOptions {
    debug: boolean;
    direction: "left" | "right";
    gap: number;
    speed: number;
}
type Container = HTMLElement;
type Slide = HTMLElement;
declare class AutoCarousel {
    /** Initial wrapper element. */
    element: HTMLElement;
    /** Options this instance of AutoCarousel is using. */
    options: AutoCarouselOptions;
    /** The element that hoAutoCarouselOptionslds the slides. */
    container: Container;
    /** Original slide elements before any doubling occurs. */
    slides: Slide[];
    constructor(element: HTMLElement, options?: AutoCarouselUserOptions);
    private initialise;
    private debug;
}

export { AutoCarousel, type AutoCarouselUserOptions };
