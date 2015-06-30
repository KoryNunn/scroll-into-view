function setElementScroll(element, x, y){
    if(element === window){
        element.scrollTo(x, y);
    }else{

        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

function getTargetScrollLocation(target, parent){
    var targetPosition = target.getBoundingClientRect(),
        parentPosition,
        x,
        y,
        differenceX,
        differenceY;

    if(parent === window){
        x = targetPosition.left + window.scrollX - window.innerWidth / 2 + Math.min(targetPosition.width, window.innerWidth) / 2;
        y = targetPosition.top + window.scrollY - window.innerHeight / 2 + Math.min(targetPosition.height, window.innerHeight) / 2;
        x = Math.max(Math.min(x, document.body.clientWidth - window.innerWidth / 2), 0);
        y = Math.max(Math.min(y, document.body.clientHeight - window.innerHeight / 2), 0);
        differenceX = x - window.scrollX;
        differenceY = y - window.scrollY;
    }else{
        parentPosition = parent.getBoundingClientRect();
        var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
        var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
        x = offsetLeft + (targetPosition.width / 2) - parent.clientWidth / 2;
        y = offsetTop + (targetPosition.height / 2) - parent.clientHeight / 2;
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
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
    requestAnimationFrame(function(){
        var scrollSettings = parent._scrollSettings;
        if(!scrollSettings){
            return;
        }

        var location = getTargetScrollLocation(scrollSettings.target, parent),
            time = Date.now() - scrollSettings.startTime,
            timeValue = 1 / scrollSettings.time * time;

        if(
            time > scrollSettings.time || 
            (Math.abs(location.differenceY) <= 1 && Math.abs(location.differenceX) <= 1)
        ){
            parent._scrollSettings = null;
            return scrollSettings.end();
        }

        // Attempt to flatten out the value a little..
        // ToDo: Flatten properly.
        var valueX = scrollSettings.ease(Math.abs(Math.pow(timeValue,2) - timeValue)),
            valueY = scrollSettings.ease(Math.abs(Math.pow(timeValue,2) - timeValue));

        setElementScroll(parent,
            location.x - (location.differenceX - location.differenceX * valueX),
            location.y - (location.differenceY - location.differenceY * valueY)
        );

        animate(parent);
    });
}

function transitionScrollTo(target, parent, settings, callback){
    var idle = !parent._scrollSettings;

    if(parent._scrollSettings){
        parent._scrollSettings.end();
    }

    function end(){
        parent._scrollSettings = null;
        callback();
        parent.removeEventListener('touchstart', end);
    }

    parent._scrollSettings = {
        startTime: Date.now(),
        target: target,
        time: settings.time,
        ease: settings.ease,
        end: end
    };
    parent.addEventListener('touchstart', end);    

    if(idle){
        animate(parent);
    }
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

    settings.time = settings.time || 1000;
    settings.ease = settings.ease || function(v){return v;};

    var parent = target.parentElement,
        parents = 0;

    function done(){
        parents--;
        if(!parents){
            callback && callback();
        }
    }

    while(parent && parent.tagName !== 'BODY'){
        if(
            (
                parent.scrollHeight !== parent.clientHeight ||
                parent.scrollWidth !== parent.clientWidth
            ) &&
            getComputedStyle(parent).overflow !== 'hidden'
        ){
            parents++;
            transitionScrollTo(target, parent, settings, done);
        }

        parent = parent.parentElement;
    }

    parents++;
    transitionScrollTo(target, window, settings, done);
};