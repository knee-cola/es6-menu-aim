import { Coordinates, MenuDirection, EventHandler, Options, ElementOffset } from './es6-menu-aim-types';

const MOUSE_LOCS_TRACKED:number = 3,  // number of past mouse locations to track
    DELAY:number = 300;  // ms delay when user appears to be entering submenu

// all instances of this class should use the same mouse-move event listener
let _mouseLocs:Array<Coordinates> = [],
    // counting instances ... this is used to detect if
    // `_mousemoveDocument` should be unregistered
    _instanceCounter = 0;

/**
 * Main class of MenuAim
 */
class MenuAim {

    activeRow:HTMLElement = null;

    lastDelayLoc:Coordinates = null;
    timeoutId:number = null;
    exitTimeoutID:number = null;
    options:Options = null;
    menu:HTMLElement = null;

    /**
     * Constructor function
     * @param menu root menu HTML element
     * @param opts (optional) config options
     */
    constructor(menu:HTMLElement, opts?:Options) {

        /**
         * Dummy function which is used as default value for event listeners
         */
        const noop = () => {};

        opts = opts || {};

        // setting the default values
        this.options = {
                rowSelector: opts.rowSelector || "> li",
                exitDelay: opts.exitDelay || null,
                submenuSelector: opts.submenuSelector || "*",
                submenuDirection: opts.submenuDirection || MenuDirection.right,
                tolerance: opts.tolerance || 75,
                isRoot: opts.isRoot || true,
                enter: opts.enter || noop,
                exit: opts.exit || noop,
                activate: opts.activate || noop,
                deactivate: opts.deactivate || noop,
                exitMenu: opts.exitMenu || noop,
                clickRow: opts.clickRow || noop
            };

        // binding event handlers
        this.mouseenterRow = this.mouseenterRow.bind(this);
        this.mouseleaveRow = this.mouseleaveRow.bind(this);
        this.clickRow = this.clickRow.bind(this);
        this.mouseleaveMenu = this.mouseleaveMenu.bind(this);
        this.commitExit = this.commitExit.bind(this);

        // attaching event listeners
        this.attach(menu);
    }

    /**
     * This method is called initially and each time a menu is re-activated
     */
    attach = function(menu:HTMLElement):void {

        this.menu = menu;

        if(this.options.isRoot) {
        // only the ROOT instance should be registering the `menuExit`
        // event ... all the contained child instances will be hidden by the root instance
            this.menu.addEventListener('mouseleave', this.mouseleaveMenu);
        }

        if(++_instanceCounter===1) {
        // IF this is the first instance
        // > register the single mouse move event handler - only one is needed
            document.addEventListener('mousemove', _mousemoveDocument);
        }
    }

    /**
     * Cancel possible row activations when leaving the menu entirely
     * @param ev Mouse Event
     */
    mouseleaveMenu(ev:Event):void {

        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if(this.options.exitDelay) {

            if(this.exitTimeoutID) {
            // IF the scheduling timer already exists -> clear it

                window.clearTimeout(this.exitTimeoutID);
                this.exitTimeoutID = null;
            }

            this.exitTimeoutID = window.setTimeout(this.commitExit, this.options.exitDelay);

        } else {
            this.commitExit();
        }
    }

    /**
     * Hides all the sub-menus and the menu. It can be called externally
     */
    forceExit():void {

        // clear the exit timeout ... if it's set
        if(this.exitTimeoutID) {
            window.clearTimeout(this.exitTimeoutID);
        }

        this.commitExit();

    }

    /**
     * Closes the menu
     */
    commitExit():void {

        this.timeoutId = this.exitTimeoutID = null;

        // IF exitMenu is supplied and returns true, deactivate the
        // currently active row on menu exit.
        if (this.options.exitMenu(self)) {
            if (this.activeRow) {
                this.options.deactivate(this.activeRow);
            }

            this.activeRow = null;
        }
    }

    /**
     * Trigger a possible row activation whenever entering a new row.
     * @param ev Mouse event
     */
    mouseenterRow(ev:MouseEvent):void {

        if(this.exitTimeoutID) {
            // console.log('schedule Exit CLEAR');
            clearTimeout(this.exitTimeoutID);
            this.exitTimeoutID = null;
        }

        if (this.timeoutId) {
            // Cancel any previous activation delays
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.options.enter(ev.target);

        this.possiblyActivate(<HTMLElement>ev.target);
    }


    mouseleaveRow(ev:MouseEvent):void {
        this.options.exit(ev.target);
    }

    /**
     * Immediately activate a row if the user clicks on it.
     * @param ev Mouse Event
     */
    clickRow(ev:MouseEvent):void {
        
        if(ev.target !== this.activeRow) {
            this.activate(<HTMLElement>ev.target);
        }

        this.options.clickRow(ev, ev.target); // pozovi registrirani event handler
    }

    /**
     * Activate a menu row.
     * @param row menu row which should be activated
     */
    activate(row:HTMLElement):void {

        if (row == this.activeRow) {
            return;
        }

        if (this.activeRow) {
            this.options.deactivate(this.activeRow);
        }

        var newRow = this.options.activate(row);

        if(newRow) {
            this.activeRow = newRow;
        } else {
            this.activeRow = row;
        }
    }

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     * 
     * @param row menu row to be activated
     */
    possiblyActivate(row:HTMLElement):void {

        let delay = this.activationDelay();
        let self = this;

        if (delay) {
            this.timeoutId = setTimeout(() => {  self.possiblyActivate(row); }, delay);
        } else {
            this.activate(row);
        }
    }

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    activationDelay():number {

        let activeRowFound:boolean = false;

        if (this.activeRow) {
        // IF active row is set
        // > check to see if it's of correct type
            let rows:NodeListOf<HTMLElement> = this.activeRow.parentElement.querySelectorAll(this.options.submenuSelector);
    
            for(let i=0,maxI=rows.length; i<maxI; i++) {
                if(rows[i] === this.activeRow) {
                    activeRowFound=true;
                    break;
                }
            }
        }

        if(!activeRowFound) {
        // IF there is no other submenu row already active, then
        // go ahead and activate immediately.
            return 0;
        }

        var offset = _offset(this.menu),
            upperLeft = {
                x: offset.left,
                y: offset.top - this.options.tolerance
            },
            upperRight = {
                x: offset.left + this.menu.offsetWidth,
                y: upperLeft.y
            },
            lowerLeft = {
                x: offset.left,
                y: offset.top + this.menu.offsetHeight + this.options.tolerance
            },
            lowerRight = {
                x: offset.left + this.menu.offsetWidth,
                y: lowerLeft.y
            },
            loc = _mouseLocs[_mouseLocs.length - 1],
            prevLoc = _mouseLocs[0];

        if (!loc) {
            return 0;
        }

        if (!prevLoc) {
            prevLoc = loc;
        }

        if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
            prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
            // If the previous mouse location was outside of the entire
            // menu's bounds, immediately activate.
            return 0;
        }

        if (this.lastDelayLoc &&
                loc.x == this.lastDelayLoc.x && loc.y == this.lastDelayLoc.y) {
            // If the mouse hasn't moved since the last time we checked
            // for activation status, immediately activate.
            return 0;
        }

        var decreasingCorner = upperRight,
            increasingCorner = lowerRight;

        // Our expectations for decreasing or increasing slope values
        // depends on which direction the submenu opens relative to the
        // main menu. By default, if the menu opens on the **right**, we
        // expect the slope between the cursor and the upper right
        // corner to decrease over time, as explained above. If the
        // submenu opens in a different direction, we change our slope
        // expectations.
        if (this.options.submenuDirection == MenuDirection.left) {
            decreasingCorner = lowerLeft;
            increasingCorner = upperLeft;
        } else if (this.options.submenuDirection == MenuDirection.below) {
            decreasingCorner = lowerRight;
            increasingCorner = lowerLeft;
        } else if (this.options.submenuDirection == MenuDirection.above) {
            decreasingCorner = upperLeft;
            increasingCorner = upperRight;
        }

        var decreasingSlope = _calcSlope(loc, decreasingCorner),
            increasingSlope = _calcSlope(loc, increasingCorner),
            prevDecreasingSlope = _calcSlope(prevLoc, decreasingCorner),
            prevIncreasingSlope = _calcSlope(prevLoc, increasingCorner);

        if (decreasingSlope < prevDecreasingSlope &&
                increasingSlope > prevIncreasingSlope) {
            // Mouse is moving from previous location towards the
            // currently activated submenu. Delay before activating a
            // new menu row, because user may be moving into submenu.
            this.lastDelayLoc = loc;
            return DELAY;
        }

        this.lastDelayLoc = null;

        return 0;
    }

    /**
     * Hook up menu item events. This method allows menu
     * items to be added externaly
     */
    hookUp(li:HTMLElement):void {
        li.addEventListener('mouseenter', this.mouseenterRow);
        li.addEventListener('mouseleave', this.mouseleaveRow);
        li.addEventListener('click', this.clickRow);
    }

    /**
     * Sets a DOM node as currently active menu item.
     * This is to be used form external code in case
     * menu item list can dynamically change
     * @param row DOM node to be set active
     */
    setActiveRow(row:HTMLElement):void {

        var self = this;

        this.activeRow = row;

        if(this.timeoutId) {
        // AKO već postoji schedulirani timeout -> resetiraj ga
            // console.log('schedule Exit CLEAR');

            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if(this.exitTimeoutID) {
        // AKO već postoji schedulirani timeout -> resetiraj ga
            // console.log('schedule Exit CLEAR');

            window.clearTimeout(this.exitTimeoutID);
            this.exitTimeoutID = null;
        }

    }

    /**
     * Deactivate menu item which is currently marked as active
     */
    deactivateRow():void {

        if(this.activeRow) {
            this.options.deactivate(this.activeRow);
        }

        this.activeRow = null;
    }

    /**
     * Detaches MenuAim from DOM containser ... to be used
     * while disposing the menu
     */
    detach():void {
        // preventing multiple calls
        if(!this.menu) {
            return;
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        if(--_instanceCounter===0) {
        // IF this was the last existing instance of the class
        // > stop tracking the mouse cusros
            document.removeEventListener('mousemove', _mousemoveDocument);
        }

        if(this.options.isRoot) {
            this.menu.removeEventListener('mouseleave', this.mouseleaveMenu)
        }

        this.timeoutId = this.lastDelayLoc = this.activeRow = this.menu = null;
    }
}

/**
 * Event handler which keep track of the last few locations of the mouse.
 * @param ev mouse event
 * @private
 */
const _mousemoveDocument = (ev:MouseEvent):void => {
    
    _mouseLocs.push({x: ev.pageX, y: ev.pageY});

    if (_mouseLocs.length > MOUSE_LOCS_TRACKED) {
        _mouseLocs.shift();
    }
}

/**
 * Detect if the user is moving towards the currently activated
 * submenu.
 * If the mouse is heading relatively clearly towards
 * the content of submenu, we should wait and give the user more
 * time before activating a new row. If the mouse is heading
 * elsewhere, we can immediately activate a new row.
 * We detect this by calculating the slope formed between the
 * current mouse location and the upper/lower right points of
 * the menu. We do the same for the previous mouse location.
 * If the current mouse location's slopes are
 * increasing/decreasing appropriately compared to the
 * previous, we know the user is moving toward the submenu.
 * Note that since the y-axis increases as the cursor moves
 * down the screen, we are looking for the slope between the
 * cursor and the upper right corner to decrease over time, not
 * increase (somewhat counterintuitively).
 * @param a 
 * @param b 
 * @private
 */
const _calcSlope = (a:Coordinates, b:Coordinates):number => {
    return ((b.y - a.y) / (b.x - a.x));
}

/**
 * Returns coordinates of the given element relative to the window
 * @param elem DOM element who's coordinates need to be calculated
 * @private
 */
const _offset = (elem:HTMLElement):ElementOffset => {

    let rect:ClientRect = elem.getBoundingClientRect(),
        win:Window = elem.ownerDocument.defaultView;

    return({
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    });
}

export { Coordinates, EventHandler, Options, MenuAim };