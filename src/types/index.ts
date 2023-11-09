export interface Coordinates {
  x: number
  y: number
}

export interface ElementOffset {
  top: number
  left: number
}

export enum MenuDirection {
  left = 'left',
  right = 'right',
  below = 'below',
  above = 'above',
}

export type EventHandler = (data: any, target?: any) => any

export interface Options {
  /**
   * Function to call when a row is purposefully activated.
   *  Use this to show a submenu's content for the activated row.
   */
  activate?: EventHandler
  /** Function to call when a row is deactivated */
  deactivate?: EventHandler
  /**
   * Function to call when mouse enters a menu row.
   *  Entering a row does not mean the row has been
   *  activated, as the user may be mousing over to a submenu.
   */
  enter?: EventHandler
  /** Function to call when mouse exits a menu row. */
  exit?: EventHandler
  /**
   * Function to call when mouse exits the entire menu. If this
   *  returns true, the current row's deactivation event and
   *  callback function will be fired. Otherwise, if this isn't
   *  supplied or it returns false, the currently activated row
   *  will stay activated when the mouse leaves the menu entirely.
   */
  exitMenu?: EventHandler
  /** Function to call when a menu row is clicked */
  clickRow?: EventHandler

  /**
   * Selector for identifying which elements in the menu are rows
   *  that can trigger the above events. Defaults to "> li".
   */
  rowSelector?: string
  /**
   * You may have some menu rows that aren't submenus and therefore
   *  shouldn't ever need to "activate." If so, filter submenu rows
   *  w/ this selector.
   *  Defaults to "*" (all elements).
   */
  submenuSelector?: string

  /**
   * Direction the submenu opens relative to the main menu.
   *  This controls which direction is "forgiving" as the user
   *  moves their cursor from the main menu into the submenu.
   *  Can be one of "right", "left", "above", or "below".
   *  Defaults to "right".
   */
  submenuDirection?: MenuDirection

  /** for how long should menu remain displayed after the mouse has left it */
  exitDelay?: number
  /** bigger = more forgiving when entering submenu */
  tolerance?: number

  /** set it to TRUE if the menu is not nested within another menu */
  isRoot?: boolean
}
