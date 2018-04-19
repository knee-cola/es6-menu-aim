import { Coordinates, EventHandler, Options } from './es6-menu-aim-types';
/**
 * Main class of MenuAim
 */
declare class MenuAim {
    activeRow: HTMLElement;
    lastDelayLoc: Coordinates;
    timeoutId: number;
    exitTimeoutID: number;
    options: Options;
    menu: HTMLElement;
    /**
     * Constructor function
     * @param menu root menu HTML element
     * @param opts (optional) config options (see [Options](#options))
     */
    constructor(menu: HTMLElement, opts?: Options);
    /**
     * This method is called initially and each time a menu is re-activated
     */
    attach: (menu: HTMLElement) => void;
    /**
     * Cancel possible row activations when leaving the menu entirely
     * @param ev Mouse Event
     */
    mouseleaveMenu(ev: Event): void;
    /**
     * Hides all the sub-menus and the menu. It can be called externally
     */
    forceExit(): void;
    /**
     * Closes the menu
     */
    commitExit(): void;
    /**
     * Trigger a possible row activation whenever entering a new row.
     * @param ev Mouse event
     */
    mouseenterRow(ev: MouseEvent): void;
    mouseleaveRow(ev: MouseEvent): void;
    /**
     * Immediately activate a row if the user clicks on it.
     * @param ev Mouse Event
     */
    clickRow(ev: MouseEvent): void;
    /**
     * Activate a menu row.
     * @param row menu row which should be activated
     */
    activate(row: HTMLElement): void;
    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     *
     * @param row menu row to be activated
     */
    possiblyActivate(row: HTMLElement): void;
    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    activationDelay(): number;
    /**
     * Hook up menu item events. This method allows menu
     * items to be added externaly
     */
    hookUp(li: HTMLElement): void;
    /**
     * Sets a DOM node as currently active menu item.
     * This is to be used form external code in case
     * menu item list can dynamically change
     * @param row DOM node to be set active
     */
    setActiveRow(row: HTMLElement): void;
    /**
     * Deactivate menu item which is currently marked as active
     */
    deactivateRow(): void;
    /**
     * Detaches MenuAim from DOM containser ... to be used
     * while disposing the menu
     */
    detach(): void;
}
export { Coordinates, EventHandler, Options, MenuAim };
