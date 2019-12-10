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