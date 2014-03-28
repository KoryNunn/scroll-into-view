function transitionScrollTo(element, x, y, startTime){
    if(!startTime){
        startTime = +new Date();
    }

    x = Math.max(Math.min(x, element.scrollWidth - element.clientWidth), 0);
    y = Math.max(Math.min(y, element.scrollHeight - element.clientHeight), 0);

    var differenceY = y - element.scrollTop,
        differenceX = x - element.scrollLeft;

    requestAnimationFrame(function(){
        if(new Date() - startTime > 350){
            // Give up and set the scroll position
            element.scrollTop += differenceY;
            element.scrollLeft += differenceX;
            return;
        }
        element.scrollTop += differenceY * 0.2 + 1;
        element.scrollLeft += differenceX * 0.2 + 1;

        if(Math.abs(differenceY) > 1 || Math.abs(differenceX) > 1){
            transitionScrollTo(element, x, y, startTime);
        }
    });
}

module.exports = function(target){
    if(!target){
        return;
    }

    var parent = target.parentNode,
        targetPosition = target.getBoundingClientRect(),
        parentOverflow;

    while(parent && parent.tagName !== 'BODY'){
        parentOverflow = window.getComputedStyle(parent).overflow;
        if(
            parentOverflow !== 'auto' ||
            parentOverflow !== 'scroll' ||
            parentOverflow !== 'scrollX' ||
            parentOverflow !== 'scrollY'
        ){
            transitionScrollTo(parent,
                Math.min(target.offsetLeft + (targetPosition.width / 2) - parent.clientWidth / 2, target.offsetLeft),
                Math.min(target.offsetTop + (targetPosition.height / 2) - parent.clientHeight / 2, target.offsetTop)
            )
        }


        parent = parent.parentNode;
    }

    transitionScrollTo(parent,
        targetPosition.left + window.scrollX - window.innerWidth / 2 + Math.min(targetPosition.width, window.innerWidth) / 2,
        targetPosition.top + window.scrollY - window.innerHeight / 2 + Math.min(targetPosition.height, window.innerHeight) / 2
    );
};