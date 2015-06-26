var targetElement,
    animationId;

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

function setElementScroll(element, x, y){
    if(element === window){
        element.scrollTo(x, y);
    }else{

        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

module.exports = function scrollTo(target, stepValue){
    if(!target){
        return;
    }

    stepValue = stepValue || 0.3;

    targetElement = target;

    function run(parent, startTime){
        animationId = requestAnimationFrame(function(){
            if(target !== targetElement) {
                cancelAnimationFrame(animationId);
                target = targetElement;
                startTime = +new Date();
            }

            var location = getTargetScrollLocation(target, parent);

            if(new Date() - startTime > 100 / stepValue){
                // Give up
                return;
            }

            setElementScroll(parent,
                location.x - (location.differenceX - location.differenceX * stepValue),
                location.y - (location.differenceY - location.differenceY * stepValue)
            );

            if(Math.abs(location.differenceY) > 1 || Math.abs(location.differenceX) > 1){
                run(parent, startTime);
            }
        });
    }

    function transitionScrollTo(parent){
        run(parent, +new Date());
    }

    var parent = target.parentElement;

    while(parent && parent.tagName !== 'BODY'){
        if(
            parent.scrollHeight !== parent.clientHeight ||
            parent.scrollWidth !== parent.clientWidth
        ){
            transitionScrollTo(parent);
        }

        parent = parent.parentElement;
    }

    transitionScrollTo(window);
};