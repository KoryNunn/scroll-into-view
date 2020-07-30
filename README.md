
![scroll-into-view](/scrollintoview.png) ![example-gif](/scrollIntoViewExample.gif)

[![Build Status](https://travis-ci.org/KoryNunn/scroll-into-view.svg?branch=master)](https://travis-ci.org/KoryNunn/scroll-into-view)
[![Backers on Open Collective](https://opencollective.com/scroll-into-view/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/scroll-into-view/sponsors/badge.svg)](#sponsors)
## What

Scrolls an element into view

Also scrolls any scroll-parents so that the element is in view.

## Donating

If you want to show your support financially, [I'm on Patreon](https://patreon.com/user/korynunn)

## Example

[Example](http://korynunn.github.io/scroll-into-view/example/)

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

All options are optional.

```javascript
scrollIntoView(someElement, {

    time: 500, // half a second


    ease: function(value){
        return Math.pow(value,2) - value; // Do something weird.
    },

    validTarget: function(target, parentsScrolled){

        // Only scroll the first two elements that don't have the class "dontScroll"
        // Element.matches is not supported in IE11, consider using Element.prototype.msMatchesSelector if you need to support that browser

        return parentsScrolled < 2 && target !== window && !target.matches('.dontScroll');
    },

    align:{
        top: 0 to 1, default 0.5 (center)
        left: 0 to 1, default 0.5 (center)
        topOffset: pixels to offset top alignment
        leftOffset: pixels to offset left alignment
    },

    isScrollable: function(target, defaultIsScrollable){

        // By default scroll-into-view will only attempt to scroll elements that have overflow not set to `"hidden"` and who's scroll width/height is larger than their client height.
        // You can override this check by passing an `isScrollable` function to settings:

        return defaultIsScrollable(target) || ~target.className.indexOf('scrollable');
    },

    isWindow: function(target){
        // If you need special detection of the window object for some reason, you can do it here.
        return target.self === target;
    },

    cancellable: true, // default is true, set to false to prevent users from cancelling the scroll with a touch or mousewheel

    maxSynchronousAlignments: 3, // default is 3. Maximum number of times to try and align elements synchronously before completing.

    debug: true // default is false. This will spit out some logs that can help you understand what scroll-into-view is doing if it isn't doing what you expect.
});
```

You can pass a callback that will be called when all scrolling has been completed or canceled.

```javascript
scrollIntoView(someElement [, settings], function(type){
    // Scrolling done.
    // type will be 'complete' if the scroll completed or 'canceled' if the current scroll was canceled by a new scroll
});
```

You can cancel the current scroll by using the cancel function returned by scrollIntoView:

```javascript
var cancel = scrollIntoView(someElement);

// ... later ...

cancel()
```

## Size

Small. ~3.03 KB for the standalone.

## Changelog

[View Changeog](https://changelogit.korynunn.com/#korynunn/scroll-into-view)

## Testing

Testing scrolling is really hard without stuff like webdriver, but what's there works ok for the moment.

The tests will attempt to launch google-chrome. If you don't have chrome, lol just kidding you do.

```
npm run test
```

# Standalone

If you want to use this module without browserify, you can use `scrollIntoView.min.js`

```
<script src="scrollIntoView.min.js"></script>

<script>
    window.scrollIntoView(someElement);
</script>
```

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/KoryNunn/scroll-into-view/graphs/contributors"><img src="https://opencollective.com/scroll-into-view/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/scroll-into-view#backer)]

<a href="https://opencollective.com/scroll-into-view#backers" target="_blank"><img src="https://opencollective.com/scroll-into-view/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/scroll-into-view#sponsor)]

<a href="https://opencollective.com/scroll-into-view/sponsor/0/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/1/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/2/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/3/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/4/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/5/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/6/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/7/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/8/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/scroll-into-view/sponsor/9/website" target="_blank"><img src="https://opencollective.com/scroll-into-view/sponsor/9/avatar.svg"></a>


