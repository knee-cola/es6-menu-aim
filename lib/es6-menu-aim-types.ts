type Coordinates = {
    x:number,
    y:number
};

type ElementOffset = {
    top:number,
    left:number
};

enum MenuDirection {
    left = "left",
    right = "right",
    below = "below",
    above = "above"
}

type EventHandler = (data:any, target?:any) => any;

type Options = {
    rowSelector?:string,
    /** for how long should menu remain displayed after the mouse has left it */
    exitDelay?:number,
    submenuSelector?:string,
    submenuDirection?:MenuDirection,
    /** bigger = more forgiving when entering submenu */
    tolerance?:number,
    /** TRUE if the menu is not nested within another menu */
    isRoot?:boolean,
    /** event handler which is called when mouse enters the menu */
    enter?: EventHandler,
    /** event handler which is called when mouse exists the menu */
    exit?: EventHandler,
    /** event handler which is called when an menu item is activated */
    activate?: EventHandler,
    /** event handler which is called when an menu item is deactivated */
    deactivate?: EventHandler,
    /** event handler which is called when mouse exists the menu */
    exitMenu?: EventHandler,
    /** event handler which is called when a menu row is clicked */
    clickRow?: EventHandler
}

export {
    Coordinates,
    MenuDirection,
    EventHandler,
    ElementOffset,
    Options
};