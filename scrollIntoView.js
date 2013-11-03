module.exports = function(target){
    if(!target){
        return;
    }

    var parent = target.parentNode,
        targetPosition;

    while(parent && parent !== document){
        targetPosition = target.getBoundingClientRect();
        parentOverflow = window.getComputedStyle(parent).overflow;
        if(
            parentOverflow !== 'auto' ||
            parentOverflow !== 'scroll' ||
            parentOverflow !== 'scrollX' ||
            parentOverflow !== 'scrollY'
        ){
            parent.scrollTop += targetPosition.top - parent.clientHeight / 2;
            parent.scrollLeft += targetPosition.left - parent.clientWidth / 2;
            console.log(targetPosition);
        }

        parent = parent.parentNode;
    }
};