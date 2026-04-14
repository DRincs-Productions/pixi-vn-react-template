export function isScrollableElement(element: HTMLElement | null): boolean {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;

    return (
        (overflowY === "auto" || overflowY === "scroll") &&
        element.scrollHeight > element.clientHeight
    );
}

export function hasScrollableParent(target: EventTarget | null): boolean {
    let el = target as HTMLElement | null;

    while (el) {
        if (isScrollableElement(el)) {
            return true;
        }
        el = el.parentElement;
    }

    return false;
}
