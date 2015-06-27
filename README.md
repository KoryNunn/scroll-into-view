# scroll-into-view

## What

Scroll's an element into view

## How

require it

    var scrollIntoView = require('scroll-into-view');

use it

    scrollIntoView(someElement);

## Timing functions

You can pass in an animation time and an array of points to create a cubic bezier curve for easing.

    scrollIntoView(someElement, 2000, [0.42, 0.0, 0.58, 1.0])

Also accepts familiar css timing functions: ease, linear, ease-in, ease-out, ease-in-out.

    scrollIntoView(someElement, 2000, 'ease-out')

Defaults set to 1000ms and 'ease'.
