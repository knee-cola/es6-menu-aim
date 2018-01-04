# What's this?

This is an ES6 re-implementation of [jQuery-menu-aim](https://github.com/kamens/jQuery-menu-aim) by [Ben Kamens](https://github.com/kamens).

It has been written so that it can be used/imported as a regular ES6 module ... like so:

```javascript
import { MenuAim } from 'es6-menu-aim';

let mAim = new MenuAim('');
```

Unlike the original *jQuery-menu-aim*, this one doesn't use jQuery ... in fact it has no dependencies.

## Why would I want use this?

The use case for menu aim is best described in README of the original [jQuery-menu-aim](https://github.com/kamens/jQuery-menu-aim).

You might want to use this one over the original 
## How to install?

Simply open up a terminal, go to your project directory and run:
```
npm i --save es6-menu-aim
```

# Documentation

<a name="MenuAim"></a>

## MenuAim
Main class of MenuAim

**Kind**: global class  

* [MenuAim](#MenuAim)
    * [new MenuAim(menu, opts)](#new_MenuAim_new)
    * [.attach()](#MenuAim+attach)
    * [.mouseleaveMenu(ev)](#MenuAim+mouseleaveMenu)
    * [.forceExit()](#MenuAim+forceExit)
    * [.commitExit()](#MenuAim+commitExit)
    * [.mouseenterRow(ev)](#MenuAim+mouseenterRow)
    * [.clickRow(ev)](#MenuAim+clickRow)
    * [.activate(row)](#MenuAim+activate)
    * [.possiblyActivate(row)](#MenuAim+possiblyActivate)
    * [.activationDelay()](#MenuAim+activationDelay)
    * [.hookUp()](#MenuAim+hookUp)
    * [.setActiveRow(row)](#MenuAim+setActiveRow)
    * [.deactivateRow()](#MenuAim+deactivateRow)
    * [.detach()](#MenuAim+detach)

<a name="new_MenuAim_new"></a>

### new MenuAim(menu, opts)
Constructor function


| Param | Description |
| --- | --- |
| menu | root menu HTML element |
| opts | (optional) config options |

<a name="MenuAim+attach"></a>

### menuAim.attach()
This method is called initially and each time a menu is re-activated

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+mouseleaveMenu"></a>

### menuAim.mouseleaveMenu(ev)
Cancel possible row activations when leaving the menu entirely

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| ev | Mouse Event |

<a name="MenuAim+forceExit"></a>

### menuAim.forceExit()
Hides all the sub-menus and the menu. It can be called externally

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+commitExit"></a>

### menuAim.commitExit()
Closes the menu

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+mouseenterRow"></a>

### menuAim.mouseenterRow(ev)
Trigger a possible row activation whenever entering a new row.

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| ev | Mouse event |

<a name="MenuAim+clickRow"></a>

### menuAim.clickRow(ev)
Immediately activate a row if the user clicks on it.

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| ev | Mouse Event |

<a name="MenuAim+activate"></a>

### menuAim.activate(row)
Activate a menu row.

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| row | menu row which should be activated |

<a name="MenuAim+possiblyActivate"></a>

### menuAim.possiblyActivate(row)
Possibly activate a menu row. If mouse movement indicates that we
shouldn't activate yet because user may be trying to enter
a submenu's content, then delay and check again later.

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| row | menu row to be activated |

<a name="MenuAim+activationDelay"></a>

### menuAim.activationDelay()
Return the amount of time that should be used as a delay before the
currently hovered row is activated.

Returns 0 if the activation should happen immediately. Otherwise,
returns the number of milliseconds that should be delayed before
checking again to see if the row should be activated.

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+hookUp"></a>

### menuAim.hookUp()
Hook up menu item events. This method allows menu
items to be added externaly

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+setActiveRow"></a>

### menuAim.setActiveRow(row)
Sets a DOM node as currently active menu item.
This is to be used form external code in case
menu item list can dynamically change

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

| Param | Description |
| --- | --- |
| row | DOM node to be set active |

<a name="MenuAim+deactivateRow"></a>

### menuAim.deactivateRow()
Deactivate menu item which is currently marked as active

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  
<a name="MenuAim+detach"></a>

### menuAim.detach()
Detaches MenuAim from DOM containser ... to be used
while disposing the menu

**Kind**: instance method of [<code>MenuAim</code>](#MenuAim)  

# License
MIT License, [http://www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)