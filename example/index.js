var crel = require('crel'),
    scrollIntoView = require('../');

window.addEventListener('load', function(){
    crel(document.body,
        crel('div', {'style':'position:absolute; height:100%; width: 100%'},
            crel('div', {'style':'position:absolute; width:200%; height: 300px; top:50%;'},
                crel('div', {'style':'position:absolute; height:200%; width: 300px; left:75%'},
                    target = crel('span', {'style':'position:absolute; top:50%;'})
                )
            )
        )
    );

    function align(){
        target.textContent = 'scrolling';
        scrollIntoView(target, {time: 1000}, function(type){
            target.textContent = type;
        });
    }
    align();

    var button,
        button2;

    crel(document.body,
        button = crel('button', {'style':'position:fixed; top: 10px; left: 10px'},
            'scroll into view'
        ),
        button2 = crel('button', {'style':'position:fixed; top: 100px; left: 10px'},
            'scroll into view with custom easing'
        )
    );

    function ease(){
        target.textContent = 'scrolling';
        scrollIntoView(target, {
            time: 1000,
            ease: function(value){
                return 1 - Math.pow(1 - value, value / 10);
            }
        }, function(type){
            target.textContent = type;
        });
    }

    button.addEventListener('click', align);
    button2.addEventListener('click', ease);
});