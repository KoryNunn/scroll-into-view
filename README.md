# scroll-into-view

## What

Scroll's an element into view

## How

require it
```javascript
var scrollIntoView = require('scroll-into-view');
```
use it

```javascript
scrollIntoView(someElement);
```

You can pass settings to control the time, easing, and whether or not a parent is a valid element to scroll, and alignment:

```javascript
scrollIntoView(someElement, {
    time: 500, // half a second
    ease: function(value){
        return Math.pow(value,2) - value); // Do something weird.
    },
    validTarget: function(target, parentsScrolled){
        return parentsScrolled < 2 && !target.matches('.dontScroll');
    },
    align:{
        top: 0 to 1, default 0.5 (center)
        left: 0 to 1, default 0.5 (center)
    }
});
```

You can pass a callback that will be called when all scrolling has been completed or canceled.

```javascript
scrollIntoView(someElement [, settings], function(type){
    // Scrolling done.
    // type will be 'complete' if the scroll completed or 'canceled' if the current scroll was canceled by a new scroll
});
```

## Testing

Testing scrolling is really hard without stuff like webdriver, but what's there works ok for the moment.

The tests will attempt to launch google-chrome. If you don't have chrome, lol just kidding you do.

```
npm run test
```
