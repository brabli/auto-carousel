type Direction = 'left' | 'right';
type AutoCarouselOptions = {
    speed: number;
    gap: number;
    direction: Direction;
};
declare class AutoCarousel {
    private element;
    private options;
    constructor(element: HTMLElement, options: AutoCarouselOptions);
    private initialise;
}

export { AutoCarousel, type AutoCarouselOptions, type Direction };
