(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var crel = require('crel'),
    scrollIntoView = require('../');

window.addEventListener('load', function(){
    var menu;
    crel(document.body,
        crel('div', {'style':'position:absolute; height:300%; width: 100%'},
            crel('div', {'style':'position:absolute; width:300%; height: 300px; top:50%;'},
                crel('div', {'style':'position:absolute; height:200%; width: 300px; left:50%'},
                    target = crel('span', {'style':'position:absolute; top:50%; width: 150px'})
                )
            )
        ),
        menu = crel('nav', { style: 'position:fixed; top:0; left:0; bottom: 0; width: 200px; border: solid 4px white;' })
    );

    function align(){
        target.textContent = 'scrolling';
        scrollIntoView(target, { debug: true, time: 1000}, function(type){
            target.textContent = type;
        });
    }
    align();

    function uncancellableAlign(){
        target.textContent = 'scrolling';
        scrollIntoView(target, { debug: true,  time: 2000, cancellable: false }, function(type){
            target.textContent = type;
        });
    }

    function ease(){
        target.textContent = 'scrolling';
        scrollIntoView(target, { debug: true,
            time: 1000,
            align:{
                top: 0,
                left: 0.5
            },
            ease: function(value){
                return 1 - Math.pow(1 - value, value / 5);
            }
        }, function(type){
            target.textContent = type;
        });
    }

    var side = 1;
    function buttonText(){
        return 'align ' + (side ? 'right' : 'left') + ' edge with menu';
    }
    function menuAlign(){
        target.textContent = 'scrolling';
        scrollIntoView(target, {
            debug: true,
            time: 1000,
            align:{
                top: 0.5,
                left: 0,
                leftOffset: side ? 200 : 40,
                topOffset: 0
            }
        }, function(type){
            target.textContent = type;
        });
        side = (side + 1) % 2;
        menuAlignButton.textContent = buttonText();
    }

    var alignButton,
        uncancellableAlignButton,
        easeButton,
        menuAlignButton;

    crel(menu,
        alignButton = crel('button', {'style':'width: 190px'},
            'scroll into view'
        ),
        uncancellableAlignButton = crel('button', {'style':'width: 190px'},
            'uncancellable scroll into view'
        ),
        easeButton = crel('button', {'style':'width: 190px'},
            'scroll into view with custom easing'
        ),
        menuAlignButton = crel('button', {'style':'width: 190px'},
            buttonText()
        )
    );

    alignButton.addEventListener('click', align);
    uncancellableAlignButton.addEventListener('click', uncancellableAlign);
    easeButton.addEventListener('click', ease);
    menuAlignButton.addEventListener('click', menuAlign);
});
},{"../":3,"crel":2}],2:[function(require,module,exports){
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.

    *** IE SUPPORT ***

    If you require this library to work in IE7, add the following after declaring crel.

    var testDiv = document.createElement('div'),
        testLabel = document.createElement('label');

    testDiv.setAttribute('class', 'a');
    testDiv['className'] !== 'a' ? crel.attrMap['class'] = 'className':undefined;
    testDiv.setAttribute('name','a');
    testDiv['name'] !== 'a' ? crel.attrMap['name'] = function(element, value){
        element.id = value;
    }:undefined;


    testLabel.setAttribute('for', 'a');
    testLabel['htmlFor'] !== 'a' ? crel.attrMap['for'] = 'htmlFor':undefined;



*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    // based on http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    var isNode = typeof Node === 'function'
        ? function (object) { return object instanceof Node; }
        : function (object) {
            return object
                && typeof object === 'object'
                && typeof object.nodeType === 'number'
                && typeof object.nodeName === 'string';
        };
    var isArray = function(a){ return a instanceof Array; };
    var appendChild = function(element, child) {
      if(!isNode(child)){
          child = document.createTextNode(child);
      }
      element.appendChild(child);
    };


    function crel(){
        var document = window.document,
            args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = args[0],
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel.attrMap;

        element = isNode(element) ? element : document.createElement(element);
        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(typeof settings !== 'object' || isNode(settings) || isArray(settings)) {
            --childIndex;
            settings = null;
        }

        // shortcut if there is only one child that is a string
        if((argumentsLength - childIndex) === 1 && typeof args[childIndex] === 'string' && element.textContent !== undefined){
            element.textContent = args[childIndex];
        }else{
            for(; childIndex < argumentsLength; ++childIndex){
                child = args[childIndex];

                if(child == null){
                    continue;
                }

                if (isArray(child)) {
                  for (var i=0; i < child.length; ++i) {
                    appendChild(element, child[i]);
                  }
                } else {
                  appendChild(element, child);
                }
            }
        }

        for(var key in settings){
            if(!attributeMap[key]){
                element.setAttribute(key, settings[key]);
            }else{
                var attr = crel.attrMap[key];
                if(typeof attr === 'function'){
                    attr(element, settings[key]);
                }else{
                    element.setAttribute(attr, settings[key]);
                }
            }
        }

        return element;
    }

    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    // String referenced so that compilers maintain the property name.
    crel['attrMap'] = {};

    // String referenced so that compilers maintain the property name.
    crel["isNode"] = isNode;

    return crel;
}));

},{}],3:[function(require,module,exports){
var COMPLETE = 'complete',
    CANCELED = 'canceled';

function raf(task){
    if('requestAnimationFrame' in window){
        return window.requestAnimationFrame(task);
    }

    setTimeout(task, 16);
}

function setElementScroll(element, x, y){
    if(element.self === element){
        element.scrollTo(x, y);
    }else{
        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

function getTargetScrollLocation(scrollSettings, parent){
    var align = scrollSettings.align,
        target = scrollSettings.target,
        targetPosition = target.getBoundingClientRect(),
        parentPosition,
        x,
        y,
        differenceX,
        differenceY,
        targetWidth,
        targetHeight,
        leftAlign = align && align.left != null ? align.left : 0.5,
        topAlign = align && align.top != null ? align.top : 0.5,
        leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
        topOffset = align && align.topOffset != null ? align.topOffset : 0,
        leftScalar = leftAlign,
        topScalar = topAlign;

    if(scrollSettings.isWindow(parent)){
        targetWidth = Math.min(targetPosition.width, parent.innerWidth);
        targetHeight = Math.min(targetPosition.height, parent.innerHeight);
        x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
        y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
        x -= leftOffset;
        y -= topOffset;
        differenceX = x - parent.pageXOffset;
        differenceY = y - parent.pageYOffset;
    }else{
        targetWidth = targetPosition.width;
        targetHeight = targetPosition.height;
        parentPosition = parent.getBoundingClientRect();
        var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
        var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
        x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
        y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
        x -= leftOffset;
        y -= topOffset;
        differenceX = x - parent.scrollLeft;
        differenceY = y - parent.scrollTop;
    }

    return {
        x: x,
        y: y,
        differenceX: differenceX,
        differenceY: differenceY
    };
}

function animate(parent){
    var scrollSettings = parent._scrollSettings;

    if(!scrollSettings){
        return;
    }

    var maxSynchronousAlignments = scrollSettings.maxSynchronousAlignments;

    var location = getTargetScrollLocation(scrollSettings, parent),
        time = Date.now() - scrollSettings.startTime,
        timeValue = Math.min(1 / scrollSettings.time * time, 1);

    if(scrollSettings.endIterations >= maxSynchronousAlignments){
        setElementScroll(parent, location.x, location.y);
        parent._scrollSettings = null;
        return scrollSettings.end(COMPLETE);
    }

    var easeValue = 1 - scrollSettings.ease(timeValue);

    setElementScroll(parent,
        location.x - location.differenceX * easeValue,
        location.y - location.differenceY * easeValue
    );

    if(time >= scrollSettings.time){
        scrollSettings.endIterations++;
        return animate(parent);
    }

    raf(animate.bind(null, parent));
}

function defaultIsWindow(target){
    return target.self === target
}

function transitionScrollTo(target, parent, settings, callback){
    var idle = !parent._scrollSettings,
        lastSettings = parent._scrollSettings,
        now = Date.now(),
        cancelHandler,
        passiveOptions = { passive: true };

    if(lastSettings){
        lastSettings.end(CANCELED);
    }

    function end(endType){
        parent._scrollSettings = null;
        if(parent.parentElement && parent.parentElement._scrollSettings){
            parent.parentElement._scrollSettings.end(endType);
        }

        if(settings.debug){
            console.log('Scrolling ended with type', endType, 'for', parent)
        }

        callback(endType);
        if(cancelHandler){
            parent.removeEventListener('touchstart', cancelHandler, passiveOptions);
            parent.removeEventListener('wheel', cancelHandler, passiveOptions);
        }
    }

    var maxSynchronousAlignments = settings.maxSynchronousAlignments;

    if(maxSynchronousAlignments == null){
        maxSynchronousAlignments = 3;
    }

    parent._scrollSettings = {
        startTime: lastSettings ? lastSettings.startTime : Date.now(),
        endIterations: 0,
        target: target,
        time: settings.time + (lastSettings ? now - lastSettings.startTime : 0),
        ease: settings.ease,
        align: settings.align,
        isWindow: settings.isWindow || defaultIsWindow,
        maxSynchronousAlignments: maxSynchronousAlignments,
        end: end
    };

    if(!('cancellable' in settings) || settings.cancellable){
        cancelHandler = end.bind(null, CANCELED);
        parent.addEventListener('touchstart', cancelHandler, passiveOptions);
        parent.addEventListener('wheel', cancelHandler, passiveOptions);
    }

    if(idle){
        animate(parent);
    }
}

function defaultIsScrollable(element){
    return (
        'pageXOffset' in element ||
        (
            element.scrollHeight !== element.clientHeight ||
            element.scrollWidth !== element.clientWidth
        ) &&
        getComputedStyle(element).overflow !== 'hidden'
    );
}

function defaultValidTarget(){
    return true;
}

module.exports = function(target, settings, callback){
    if(!target){
        return;
    }

    if(typeof settings === 'function'){
        callback = settings;
        settings = null;
    }

    if(!settings){
        settings = {};
    }

    settings.time = isNaN(settings.time) ? 1000 : settings.time;
    settings.ease = settings.ease || function(v){return 1 - Math.pow(1 - v, v / 2);};

    var parent = (target.assignedSlot || target).parentElement,
        parents = 1;

    function done(endType){
        parents--;
        if(!parents){
            callback && callback(endType);
        }
    }

    var validTarget = settings.validTarget || defaultValidTarget;
    var isScrollable = settings.isScrollable;

    if(settings.debug){
        console.log('About to scroll to', target)

        if(!parent){
            console.error('Target did not have a parent, is it mounted in the DOM?')
        }
    }

    while(parent){
        if(parent.tagName === 'BODY'){
            parent = parent.ownerDocument;
            parent = parent.defaultView || parent.ownerWindow;
        }

        if(settings.debug){
            console.log('Scrolling parent node', parent)
        }

        if(validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))){
            parents++;
            transitionScrollTo(target, parent, settings, done);
        }
        
        parent = (parent.assignedSlot || parent).parentElement;

        if(!parent){
            done(COMPLETE)
            break;
        }
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NyZWwvY3JlbC5qcyIsInNjcm9sbEludG9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBjcmVsID0gcmVxdWlyZSgnY3JlbCcpLFxuICAgIHNjcm9sbEludG9WaWV3ID0gcmVxdWlyZSgnLi4vJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgbWVudTtcbiAgICBjcmVsKGRvY3VtZW50LmJvZHksXG4gICAgICAgIGNyZWwoJ2RpdicsIHsnc3R5bGUnOidwb3NpdGlvbjphYnNvbHV0ZTsgaGVpZ2h0OjMwMCU7IHdpZHRoOiAxMDAlJ30sXG4gICAgICAgICAgICBjcmVsKCdkaXYnLCB7J3N0eWxlJzoncG9zaXRpb246YWJzb2x1dGU7IHdpZHRoOjMwMCU7IGhlaWdodDogMzAwcHg7IHRvcDo1MCU7J30sXG4gICAgICAgICAgICAgICAgY3JlbCgnZGl2JywgeydzdHlsZSc6J3Bvc2l0aW9uOmFic29sdXRlOyBoZWlnaHQ6MjAwJTsgd2lkdGg6IDMwMHB4OyBsZWZ0OjUwJSd9LFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBjcmVsKCdzcGFuJywgeydzdHlsZSc6J3Bvc2l0aW9uOmFic29sdXRlOyB0b3A6NTAlOyB3aWR0aDogMTUwcHgnfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIG1lbnUgPSBjcmVsKCduYXYnLCB7IHN0eWxlOiAncG9zaXRpb246Zml4ZWQ7IHRvcDowOyBsZWZ0OjA7IGJvdHRvbTogMDsgd2lkdGg6IDIwMHB4OyBib3JkZXI6IHNvbGlkIDRweCB3aGl0ZTsnIH0pXG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGFsaWduKCl7XG4gICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICdzY3JvbGxpbmcnO1xuICAgICAgICBzY3JvbGxJbnRvVmlldyh0YXJnZXQsIHsgZGVidWc6IHRydWUsIHRpbWU6IDEwMDB9LCBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IHR5cGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhbGlnbigpO1xuXG4gICAgZnVuY3Rpb24gdW5jYW5jZWxsYWJsZUFsaWduKCl7XG4gICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICdzY3JvbGxpbmcnO1xuICAgICAgICBzY3JvbGxJbnRvVmlldyh0YXJnZXQsIHsgZGVidWc6IHRydWUsICB0aW1lOiAyMDAwLCBjYW5jZWxsYWJsZTogZmFsc2UgfSwgZnVuY3Rpb24odHlwZSl7XG4gICAgICAgICAgICB0YXJnZXQudGV4dENvbnRlbnQgPSB0eXBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlYXNlKCl7XG4gICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICdzY3JvbGxpbmcnO1xuICAgICAgICBzY3JvbGxJbnRvVmlldyh0YXJnZXQsIHsgZGVidWc6IHRydWUsXG4gICAgICAgICAgICB0aW1lOiAxMDAwLFxuICAgICAgICAgICAgYWxpZ246e1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLjVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlYXNlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gdmFsdWUsIHZhbHVlIC8gNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICAgICAgdGFyZ2V0LnRleHRDb250ZW50ID0gdHlwZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIHNpZGUgPSAxO1xuICAgIGZ1bmN0aW9uIGJ1dHRvblRleHQoKXtcbiAgICAgICAgcmV0dXJuICdhbGlnbiAnICsgKHNpZGUgPyAncmlnaHQnIDogJ2xlZnQnKSArICcgZWRnZSB3aXRoIG1lbnUnO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtZW51QWxpZ24oKXtcbiAgICAgICAgdGFyZ2V0LnRleHRDb250ZW50ID0gJ3Njcm9sbGluZyc7XG4gICAgICAgIHNjcm9sbEludG9WaWV3KHRhcmdldCwge1xuICAgICAgICAgICAgZGVidWc6IHRydWUsXG4gICAgICAgICAgICB0aW1lOiAxMDAwLFxuICAgICAgICAgICAgYWxpZ246e1xuICAgICAgICAgICAgICAgIHRvcDogMC41LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldDogc2lkZSA/IDIwMCA6IDQwLFxuICAgICAgICAgICAgICAgIHRvcE9mZnNldDogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IHR5cGU7XG4gICAgICAgIH0pO1xuICAgICAgICBzaWRlID0gKHNpZGUgKyAxKSAlIDI7XG4gICAgICAgIG1lbnVBbGlnbkJ1dHRvbi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHQoKTtcbiAgICB9XG5cbiAgICB2YXIgYWxpZ25CdXR0b24sXG4gICAgICAgIHVuY2FuY2VsbGFibGVBbGlnbkJ1dHRvbixcbiAgICAgICAgZWFzZUJ1dHRvbixcbiAgICAgICAgbWVudUFsaWduQnV0dG9uO1xuXG4gICAgY3JlbChtZW51LFxuICAgICAgICBhbGlnbkJ1dHRvbiA9IGNyZWwoJ2J1dHRvbicsIHsnc3R5bGUnOid3aWR0aDogMTkwcHgnfSxcbiAgICAgICAgICAgICdzY3JvbGwgaW50byB2aWV3J1xuICAgICAgICApLFxuICAgICAgICB1bmNhbmNlbGxhYmxlQWxpZ25CdXR0b24gPSBjcmVsKCdidXR0b24nLCB7J3N0eWxlJzond2lkdGg6IDE5MHB4J30sXG4gICAgICAgICAgICAndW5jYW5jZWxsYWJsZSBzY3JvbGwgaW50byB2aWV3J1xuICAgICAgICApLFxuICAgICAgICBlYXNlQnV0dG9uID0gY3JlbCgnYnV0dG9uJywgeydzdHlsZSc6J3dpZHRoOiAxOTBweCd9LFxuICAgICAgICAgICAgJ3Njcm9sbCBpbnRvIHZpZXcgd2l0aCBjdXN0b20gZWFzaW5nJ1xuICAgICAgICApLFxuICAgICAgICBtZW51QWxpZ25CdXR0b24gPSBjcmVsKCdidXR0b24nLCB7J3N0eWxlJzond2lkdGg6IDE5MHB4J30sXG4gICAgICAgICAgICBidXR0b25UZXh0KClcbiAgICAgICAgKVxuICAgICk7XG5cbiAgICBhbGlnbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFsaWduKTtcbiAgICB1bmNhbmNlbGxhYmxlQWxpZ25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB1bmNhbmNlbGxhYmxlQWxpZ24pO1xuICAgIGVhc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlYXNlKTtcbiAgICBtZW51QWxpZ25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtZW51QWxpZ24pO1xufSk7IiwiLy9Db3B5cmlnaHQgKEMpIDIwMTIgS29yeSBOdW5uXHJcblxyXG4vL1Blcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4vL1RoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuLy9USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuXHJcbi8qXHJcblxyXG4gICAgVGhpcyBjb2RlIGlzIG5vdCBmb3JtYXR0ZWQgZm9yIHJlYWRhYmlsaXR5LCBidXQgcmF0aGVyIHJ1bi1zcGVlZCBhbmQgdG8gYXNzaXN0IGNvbXBpbGVycy5cclxuXHJcbiAgICBIb3dldmVyLCB0aGUgY29kZSdzIGludGVudGlvbiBzaG91bGQgYmUgdHJhbnNwYXJlbnQuXHJcblxyXG4gICAgKioqIElFIFNVUFBPUlQgKioqXHJcblxyXG4gICAgSWYgeW91IHJlcXVpcmUgdGhpcyBsaWJyYXJ5IHRvIHdvcmsgaW4gSUU3LCBhZGQgdGhlIGZvbGxvd2luZyBhZnRlciBkZWNsYXJpbmcgY3JlbC5cclxuXHJcbiAgICB2YXIgdGVzdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgIHRlc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcblxyXG4gICAgdGVzdERpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2EnKTtcclxuICAgIHRlc3REaXZbJ2NsYXNzTmFtZSddICE9PSAnYScgPyBjcmVsLmF0dHJNYXBbJ2NsYXNzJ10gPSAnY2xhc3NOYW1lJzp1bmRlZmluZWQ7XHJcbiAgICB0ZXN0RGl2LnNldEF0dHJpYnV0ZSgnbmFtZScsJ2EnKTtcclxuICAgIHRlc3REaXZbJ25hbWUnXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWyduYW1lJ10gPSBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSl7XHJcbiAgICAgICAgZWxlbWVudC5pZCA9IHZhbHVlO1xyXG4gICAgfTp1bmRlZmluZWQ7XHJcblxyXG5cclxuICAgIHRlc3RMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdhJyk7XHJcbiAgICB0ZXN0TGFiZWxbJ2h0bWxGb3InXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWydmb3InXSA9ICdodG1sRm9yJzp1bmRlZmluZWQ7XHJcblxyXG5cclxuXHJcbiovXHJcblxyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb290LmNyZWwgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gYmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zODQyODYvamF2YXNjcmlwdC1pc2RvbS1ob3ctZG8teW91LWNoZWNrLWlmLWEtamF2YXNjcmlwdC1vYmplY3QtaXMtYS1kb20tb2JqZWN0XHJcbiAgICB2YXIgaXNOb2RlID0gdHlwZW9mIE5vZGUgPT09ICdmdW5jdGlvbidcclxuICAgICAgICA/IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIE5vZGU7IH1cclxuICAgICAgICA6IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCdcclxuICAgICAgICAgICAgICAgICYmIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgPT09ICdudW1iZXInXHJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2Ygb2JqZWN0Lm5vZGVOYW1lID09PSAnc3RyaW5nJztcclxuICAgICAgICB9O1xyXG4gICAgdmFyIGlzQXJyYXkgPSBmdW5jdGlvbihhKXsgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheTsgfTtcclxuICAgIHZhciBhcHBlbmRDaGlsZCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNoaWxkKSB7XHJcbiAgICAgIGlmKCFpc05vZGUoY2hpbGQpKXtcclxuICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlbCgpe1xyXG4gICAgICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcclxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cywgLy9Ob3RlOiBhc3NpZ25lZCB0byBhIHZhcmlhYmxlIHRvIGFzc2lzdCBjb21waWxlcnMuIFNhdmVzIGFib3V0IDQwIGJ5dGVzIGluIGNsb3N1cmUgY29tcGlsZXIuIEhhcyBuZWdsaWdhYmxlIGVmZmVjdCBvbiBwZXJmb3JtYW5jZS5cclxuICAgICAgICAgICAgZWxlbWVudCA9IGFyZ3NbMF0sXHJcbiAgICAgICAgICAgIGNoaWxkLFxyXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0sXHJcbiAgICAgICAgICAgIGNoaWxkSW5kZXggPSAyLFxyXG4gICAgICAgICAgICBhcmd1bWVudHNMZW5ndGggPSBhcmdzLmxlbmd0aCxcclxuICAgICAgICAgICAgYXR0cmlidXRlTWFwID0gY3JlbC5hdHRyTWFwO1xyXG5cclxuICAgICAgICBlbGVtZW50ID0gaXNOb2RlKGVsZW1lbnQpID8gZWxlbWVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgLy8gc2hvcnRjdXRcclxuICAgICAgICBpZihhcmd1bWVudHNMZW5ndGggPT09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBzZXR0aW5ncyAhPT0gJ29iamVjdCcgfHwgaXNOb2RlKHNldHRpbmdzKSB8fCBpc0FycmF5KHNldHRpbmdzKSkge1xyXG4gICAgICAgICAgICAtLWNoaWxkSW5kZXg7XHJcbiAgICAgICAgICAgIHNldHRpbmdzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHNob3J0Y3V0IGlmIHRoZXJlIGlzIG9ubHkgb25lIGNoaWxkIHRoYXQgaXMgYSBzdHJpbmdcclxuICAgICAgICBpZigoYXJndW1lbnRzTGVuZ3RoIC0gY2hpbGRJbmRleCkgPT09IDEgJiYgdHlwZW9mIGFyZ3NbY2hpbGRJbmRleF0gPT09ICdzdHJpbmcnICYmIGVsZW1lbnQudGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBhcmdzW2NoaWxkSW5kZXhdO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBmb3IoOyBjaGlsZEluZGV4IDwgYXJndW1lbnRzTGVuZ3RoOyArK2NoaWxkSW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBhcmdzW2NoaWxkSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGNoaWxkID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBjaGlsZC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIGNoaWxkW2ldKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYXBwZW5kQ2hpbGQoZWxlbWVudCwgY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBzZXR0aW5ncyl7XHJcbiAgICAgICAgICAgIGlmKCFhdHRyaWJ1dGVNYXBba2V5XSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHNldHRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gY3JlbC5hdHRyTWFwW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgYXR0ciA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cihlbGVtZW50LCBzZXR0aW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIHNldHRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2VkIGZvciBtYXBwaW5nIG9uZSBraW5kIG9mIGF0dHJpYnV0ZSB0byB0aGUgc3VwcG9ydGVkIHZlcnNpb24gb2YgdGhhdCBpbiBiYWQgYnJvd3NlcnMuXHJcbiAgICAvLyBTdHJpbmcgcmVmZXJlbmNlZCBzbyB0aGF0IGNvbXBpbGVycyBtYWludGFpbiB0aGUgcHJvcGVydHkgbmFtZS5cclxuICAgIGNyZWxbJ2F0dHJNYXAnXSA9IHt9O1xyXG5cclxuICAgIC8vIFN0cmluZyByZWZlcmVuY2VkIHNvIHRoYXQgY29tcGlsZXJzIG1haW50YWluIHRoZSBwcm9wZXJ0eSBuYW1lLlxyXG4gICAgY3JlbFtcImlzTm9kZVwiXSA9IGlzTm9kZTtcclxuXHJcbiAgICByZXR1cm4gY3JlbDtcclxufSkpO1xyXG4iLCJ2YXIgQ09NUExFVEUgPSAnY29tcGxldGUnLFxuICAgIENBTkNFTEVEID0gJ2NhbmNlbGVkJztcblxuZnVuY3Rpb24gcmFmKHRhc2spe1xuICAgIGlmKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIGluIHdpbmRvdyl7XG4gICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRhc2spO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQodGFzaywgMTYpO1xufVxuXG5mdW5jdGlvbiBzZXRFbGVtZW50U2Nyb2xsKGVsZW1lbnQsIHgsIHkpe1xuICAgIGlmKGVsZW1lbnQuc2VsZiA9PT0gZWxlbWVudCl7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsVG8oeCwgeSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsTGVmdCA9IHg7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0geTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFRhcmdldFNjcm9sbExvY2F0aW9uKHNjcm9sbFNldHRpbmdzLCBwYXJlbnQpe1xuICAgIHZhciBhbGlnbiA9IHNjcm9sbFNldHRpbmdzLmFsaWduLFxuICAgICAgICB0YXJnZXQgPSBzY3JvbGxTZXR0aW5ncy50YXJnZXQsXG4gICAgICAgIHRhcmdldFBvc2l0aW9uID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICBwYXJlbnRQb3NpdGlvbixcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgZGlmZmVyZW5jZVgsXG4gICAgICAgIGRpZmZlcmVuY2VZLFxuICAgICAgICB0YXJnZXRXaWR0aCxcbiAgICAgICAgdGFyZ2V0SGVpZ2h0LFxuICAgICAgICBsZWZ0QWxpZ24gPSBhbGlnbiAmJiBhbGlnbi5sZWZ0ICE9IG51bGwgPyBhbGlnbi5sZWZ0IDogMC41LFxuICAgICAgICB0b3BBbGlnbiA9IGFsaWduICYmIGFsaWduLnRvcCAhPSBudWxsID8gYWxpZ24udG9wIDogMC41LFxuICAgICAgICBsZWZ0T2Zmc2V0ID0gYWxpZ24gJiYgYWxpZ24ubGVmdE9mZnNldCAhPSBudWxsID8gYWxpZ24ubGVmdE9mZnNldCA6IDAsXG4gICAgICAgIHRvcE9mZnNldCA9IGFsaWduICYmIGFsaWduLnRvcE9mZnNldCAhPSBudWxsID8gYWxpZ24udG9wT2Zmc2V0IDogMCxcbiAgICAgICAgbGVmdFNjYWxhciA9IGxlZnRBbGlnbixcbiAgICAgICAgdG9wU2NhbGFyID0gdG9wQWxpZ247XG5cbiAgICBpZihzY3JvbGxTZXR0aW5ncy5pc1dpbmRvdyhwYXJlbnQpKXtcbiAgICAgICAgdGFyZ2V0V2lkdGggPSBNYXRoLm1pbih0YXJnZXRQb3NpdGlvbi53aWR0aCwgcGFyZW50LmlubmVyV2lkdGgpO1xuICAgICAgICB0YXJnZXRIZWlnaHQgPSBNYXRoLm1pbih0YXJnZXRQb3NpdGlvbi5oZWlnaHQsIHBhcmVudC5pbm5lckhlaWdodCk7XG4gICAgICAgIHggPSB0YXJnZXRQb3NpdGlvbi5sZWZ0ICsgcGFyZW50LnBhZ2VYT2Zmc2V0IC0gcGFyZW50LmlubmVyV2lkdGggKiBsZWZ0U2NhbGFyICsgdGFyZ2V0V2lkdGggKiBsZWZ0U2NhbGFyO1xuICAgICAgICB5ID0gdGFyZ2V0UG9zaXRpb24udG9wICsgcGFyZW50LnBhZ2VZT2Zmc2V0IC0gcGFyZW50LmlubmVySGVpZ2h0ICogdG9wU2NhbGFyICsgdGFyZ2V0SGVpZ2h0ICogdG9wU2NhbGFyO1xuICAgICAgICB4IC09IGxlZnRPZmZzZXQ7XG4gICAgICAgIHkgLT0gdG9wT2Zmc2V0O1xuICAgICAgICBkaWZmZXJlbmNlWCA9IHggLSBwYXJlbnQucGFnZVhPZmZzZXQ7XG4gICAgICAgIGRpZmZlcmVuY2VZID0geSAtIHBhcmVudC5wYWdlWU9mZnNldDtcbiAgICB9ZWxzZXtcbiAgICAgICAgdGFyZ2V0V2lkdGggPSB0YXJnZXRQb3NpdGlvbi53aWR0aDtcbiAgICAgICAgdGFyZ2V0SGVpZ2h0ID0gdGFyZ2V0UG9zaXRpb24uaGVpZ2h0O1xuICAgICAgICBwYXJlbnRQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSB0YXJnZXRQb3NpdGlvbi5sZWZ0IC0gKHBhcmVudFBvc2l0aW9uLmxlZnQgLSBwYXJlbnQuc2Nyb2xsTGVmdCk7XG4gICAgICAgIHZhciBvZmZzZXRUb3AgPSB0YXJnZXRQb3NpdGlvbi50b3AgLSAocGFyZW50UG9zaXRpb24udG9wIC0gcGFyZW50LnNjcm9sbFRvcCk7XG4gICAgICAgIHggPSBvZmZzZXRMZWZ0ICsgKHRhcmdldFdpZHRoICogbGVmdFNjYWxhcikgLSBwYXJlbnQuY2xpZW50V2lkdGggKiBsZWZ0U2NhbGFyO1xuICAgICAgICB5ID0gb2Zmc2V0VG9wICsgKHRhcmdldEhlaWdodCAqIHRvcFNjYWxhcikgLSBwYXJlbnQuY2xpZW50SGVpZ2h0ICogdG9wU2NhbGFyO1xuICAgICAgICB4ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwgcGFyZW50LnNjcm9sbFdpZHRoIC0gcGFyZW50LmNsaWVudFdpZHRoKSwgMCk7XG4gICAgICAgIHkgPSBNYXRoLm1heChNYXRoLm1pbih5LCBwYXJlbnQuc2Nyb2xsSGVpZ2h0IC0gcGFyZW50LmNsaWVudEhlaWdodCksIDApO1xuICAgICAgICB4IC09IGxlZnRPZmZzZXQ7XG4gICAgICAgIHkgLT0gdG9wT2Zmc2V0O1xuICAgICAgICBkaWZmZXJlbmNlWCA9IHggLSBwYXJlbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgZGlmZmVyZW5jZVkgPSB5IC0gcGFyZW50LnNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICBkaWZmZXJlbmNlWDogZGlmZmVyZW5jZVgsXG4gICAgICAgIGRpZmZlcmVuY2VZOiBkaWZmZXJlbmNlWVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUocGFyZW50KXtcbiAgICB2YXIgc2Nyb2xsU2V0dGluZ3MgPSBwYXJlbnQuX3Njcm9sbFNldHRpbmdzO1xuXG4gICAgaWYoIXNjcm9sbFNldHRpbmdzKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtYXhTeW5jaHJvbm91c0FsaWdubWVudHMgPSBzY3JvbGxTZXR0aW5ncy5tYXhTeW5jaHJvbm91c0FsaWdubWVudHM7XG5cbiAgICB2YXIgbG9jYXRpb24gPSBnZXRUYXJnZXRTY3JvbGxMb2NhdGlvbihzY3JvbGxTZXR0aW5ncywgcGFyZW50KSxcbiAgICAgICAgdGltZSA9IERhdGUubm93KCkgLSBzY3JvbGxTZXR0aW5ncy5zdGFydFRpbWUsXG4gICAgICAgIHRpbWVWYWx1ZSA9IE1hdGgubWluKDEgLyBzY3JvbGxTZXR0aW5ncy50aW1lICogdGltZSwgMSk7XG5cbiAgICBpZihzY3JvbGxTZXR0aW5ncy5lbmRJdGVyYXRpb25zID49IG1heFN5bmNocm9ub3VzQWxpZ25tZW50cyl7XG4gICAgICAgIHNldEVsZW1lbnRTY3JvbGwocGFyZW50LCBsb2NhdGlvbi54LCBsb2NhdGlvbi55KTtcbiAgICAgICAgcGFyZW50Ll9zY3JvbGxTZXR0aW5ncyA9IG51bGw7XG4gICAgICAgIHJldHVybiBzY3JvbGxTZXR0aW5ncy5lbmQoQ09NUExFVEUpO1xuICAgIH1cblxuICAgIHZhciBlYXNlVmFsdWUgPSAxIC0gc2Nyb2xsU2V0dGluZ3MuZWFzZSh0aW1lVmFsdWUpO1xuXG4gICAgc2V0RWxlbWVudFNjcm9sbChwYXJlbnQsXG4gICAgICAgIGxvY2F0aW9uLnggLSBsb2NhdGlvbi5kaWZmZXJlbmNlWCAqIGVhc2VWYWx1ZSxcbiAgICAgICAgbG9jYXRpb24ueSAtIGxvY2F0aW9uLmRpZmZlcmVuY2VZICogZWFzZVZhbHVlXG4gICAgKTtcblxuICAgIGlmKHRpbWUgPj0gc2Nyb2xsU2V0dGluZ3MudGltZSl7XG4gICAgICAgIHNjcm9sbFNldHRpbmdzLmVuZEl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIGFuaW1hdGUocGFyZW50KTtcbiAgICB9XG5cbiAgICByYWYoYW5pbWF0ZS5iaW5kKG51bGwsIHBhcmVudCkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0SXNXaW5kb3codGFyZ2V0KXtcbiAgICByZXR1cm4gdGFyZ2V0LnNlbGYgPT09IHRhcmdldFxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uU2Nyb2xsVG8odGFyZ2V0LCBwYXJlbnQsIHNldHRpbmdzLCBjYWxsYmFjayl7XG4gICAgdmFyIGlkbGUgPSAhcGFyZW50Ll9zY3JvbGxTZXR0aW5ncyxcbiAgICAgICAgbGFzdFNldHRpbmdzID0gcGFyZW50Ll9zY3JvbGxTZXR0aW5ncyxcbiAgICAgICAgbm93ID0gRGF0ZS5ub3coKSxcbiAgICAgICAgY2FuY2VsSGFuZGxlcixcbiAgICAgICAgcGFzc2l2ZU9wdGlvbnMgPSB7IHBhc3NpdmU6IHRydWUgfTtcblxuICAgIGlmKGxhc3RTZXR0aW5ncyl7XG4gICAgICAgIGxhc3RTZXR0aW5ncy5lbmQoQ0FOQ0VMRUQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZChlbmRUeXBlKXtcbiAgICAgICAgcGFyZW50Ll9zY3JvbGxTZXR0aW5ncyA9IG51bGw7XG4gICAgICAgIGlmKHBhcmVudC5wYXJlbnRFbGVtZW50ICYmIHBhcmVudC5wYXJlbnRFbGVtZW50Ll9zY3JvbGxTZXR0aW5ncyl7XG4gICAgICAgICAgICBwYXJlbnQucGFyZW50RWxlbWVudC5fc2Nyb2xsU2V0dGluZ3MuZW5kKGVuZFR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoc2V0dGluZ3MuZGVidWcpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Njcm9sbGluZyBlbmRlZCB3aXRoIHR5cGUnLCBlbmRUeXBlLCAnZm9yJywgcGFyZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZW5kVHlwZSk7XG4gICAgICAgIGlmKGNhbmNlbEhhbmRsZXIpe1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBjYW5jZWxIYW5kbGVyLCBwYXNzaXZlT3B0aW9ucyk7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBjYW5jZWxIYW5kbGVyLCBwYXNzaXZlT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbWF4U3luY2hyb25vdXNBbGlnbm1lbnRzID0gc2V0dGluZ3MubWF4U3luY2hyb25vdXNBbGlnbm1lbnRzO1xuXG4gICAgaWYobWF4U3luY2hyb25vdXNBbGlnbm1lbnRzID09IG51bGwpe1xuICAgICAgICBtYXhTeW5jaHJvbm91c0FsaWdubWVudHMgPSAzO1xuICAgIH1cblxuICAgIHBhcmVudC5fc2Nyb2xsU2V0dGluZ3MgPSB7XG4gICAgICAgIHN0YXJ0VGltZTogbGFzdFNldHRpbmdzID8gbGFzdFNldHRpbmdzLnN0YXJ0VGltZSA6IERhdGUubm93KCksXG4gICAgICAgIGVuZEl0ZXJhdGlvbnM6IDAsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICB0aW1lOiBzZXR0aW5ncy50aW1lICsgKGxhc3RTZXR0aW5ncyA/IG5vdyAtIGxhc3RTZXR0aW5ncy5zdGFydFRpbWUgOiAwKSxcbiAgICAgICAgZWFzZTogc2V0dGluZ3MuZWFzZSxcbiAgICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxuICAgICAgICBpc1dpbmRvdzogc2V0dGluZ3MuaXNXaW5kb3cgfHwgZGVmYXVsdElzV2luZG93LFxuICAgICAgICBtYXhTeW5jaHJvbm91c0FsaWdubWVudHM6IG1heFN5bmNocm9ub3VzQWxpZ25tZW50cyxcbiAgICAgICAgZW5kOiBlbmRcbiAgICB9O1xuXG4gICAgaWYoISgnY2FuY2VsbGFibGUnIGluIHNldHRpbmdzKSB8fCBzZXR0aW5ncy5jYW5jZWxsYWJsZSl7XG4gICAgICAgIGNhbmNlbEhhbmRsZXIgPSBlbmQuYmluZChudWxsLCBDQU5DRUxFRCk7XG4gICAgICAgIHBhcmVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgY2FuY2VsSGFuZGxlciwgcGFzc2l2ZU9wdGlvbnMpO1xuICAgICAgICBwYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBjYW5jZWxIYW5kbGVyLCBwYXNzaXZlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYoaWRsZSl7XG4gICAgICAgIGFuaW1hdGUocGFyZW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRJc1Njcm9sbGFibGUoZWxlbWVudCl7XG4gICAgcmV0dXJuIChcbiAgICAgICAgJ3BhZ2VYT2Zmc2V0JyBpbiBlbGVtZW50IHx8XG4gICAgICAgIChcbiAgICAgICAgICAgIGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ICE9PSBlbGVtZW50LmNsaWVudEhlaWdodCB8fFxuICAgICAgICAgICAgZWxlbWVudC5zY3JvbGxXaWR0aCAhPT0gZWxlbWVudC5jbGllbnRXaWR0aFxuICAgICAgICApICYmXG4gICAgICAgIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkub3ZlcmZsb3cgIT09ICdoaWRkZW4nXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFZhbGlkVGFyZ2V0KCl7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzZXR0aW5ncywgY2FsbGJhY2spe1xuICAgIGlmKCF0YXJnZXQpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYodHlwZW9mIHNldHRpbmdzID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgY2FsbGJhY2sgPSBzZXR0aW5ncztcbiAgICAgICAgc2V0dGluZ3MgPSBudWxsO1xuICAgIH1cblxuICAgIGlmKCFzZXR0aW5ncyl7XG4gICAgICAgIHNldHRpbmdzID0ge307XG4gICAgfVxuXG4gICAgc2V0dGluZ3MudGltZSA9IGlzTmFOKHNldHRpbmdzLnRpbWUpID8gMTAwMCA6IHNldHRpbmdzLnRpbWU7XG4gICAgc2V0dGluZ3MuZWFzZSA9IHNldHRpbmdzLmVhc2UgfHwgZnVuY3Rpb24odil7cmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gdiwgdiAvIDIpO307XG5cbiAgICB2YXIgcGFyZW50ID0gKHRhcmdldC5hc3NpZ25lZFNsb3QgfHwgdGFyZ2V0KS5wYXJlbnRFbGVtZW50LFxuICAgICAgICBwYXJlbnRzID0gMTtcblxuICAgIGZ1bmN0aW9uIGRvbmUoZW5kVHlwZSl7XG4gICAgICAgIHBhcmVudHMtLTtcbiAgICAgICAgaWYoIXBhcmVudHMpe1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZW5kVHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdmFsaWRUYXJnZXQgPSBzZXR0aW5ncy52YWxpZFRhcmdldCB8fCBkZWZhdWx0VmFsaWRUYXJnZXQ7XG4gICAgdmFyIGlzU2Nyb2xsYWJsZSA9IHNldHRpbmdzLmlzU2Nyb2xsYWJsZTtcblxuICAgIGlmKHNldHRpbmdzLmRlYnVnKXtcbiAgICAgICAgY29uc29sZS5sb2coJ0Fib3V0IHRvIHNjcm9sbCB0bycsIHRhcmdldClcblxuICAgICAgICBpZighcGFyZW50KXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RhcmdldCBkaWQgbm90IGhhdmUgYSBwYXJlbnQsIGlzIGl0IG1vdW50ZWQgaW4gdGhlIERPTT8nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUocGFyZW50KXtcbiAgICAgICAgaWYocGFyZW50LnRhZ05hbWUgPT09ICdCT0RZJyl7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5kZWZhdWx0VmlldyB8fCBwYXJlbnQub3duZXJXaW5kb3c7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzZXR0aW5ncy5kZWJ1Zyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2Nyb2xsaW5nIHBhcmVudCBub2RlJywgcGFyZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodmFsaWRUYXJnZXQocGFyZW50LCBwYXJlbnRzKSAmJiAoaXNTY3JvbGxhYmxlID8gaXNTY3JvbGxhYmxlKHBhcmVudCwgZGVmYXVsdElzU2Nyb2xsYWJsZSkgOiBkZWZhdWx0SXNTY3JvbGxhYmxlKHBhcmVudCkpKXtcbiAgICAgICAgICAgIHBhcmVudHMrKztcbiAgICAgICAgICAgIHRyYW5zaXRpb25TY3JvbGxUbyh0YXJnZXQsIHBhcmVudCwgc2V0dGluZ3MsIGRvbmUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwYXJlbnQgPSAocGFyZW50LmFzc2lnbmVkU2xvdCB8fCBwYXJlbnQpLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgaWYoIXBhcmVudCl7XG4gICAgICAgICAgICBkb25lKENPTVBMRVRFKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIl19
