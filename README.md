# scroll-into-view

## What

Scroll's an element into view

## How

require it

    var scrollIntoView = require('scroll-into-view');

use it

    scrollIntoView(someElement);

You can pass settings to control the time, easing, and whether or not a parent is a valid element to scroll:

    scrollIntoView(someElement, {
        time: 500, // half a second
        ease: function(value){
            return Math.pow(value,2) - value); // Do something weird.
        },
        validTarget: function(target, parentsScrolled){
            return parentsScrolled < 2 && !target.matches('.dontScroll');
        }
    });

You can pass a callback that will be called when all scrolling has been completed or canceled.

    scrollIntoView(someElement [, settings], function(){
        // Scrolling done.
    })