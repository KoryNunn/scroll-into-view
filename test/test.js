var test = require('tape'),
    crel = require('crel'),
    scrollIntoView = require('../');

function reset(){
    document.body.innerHTML = '';
}


window.addEventListener('load', function(){
    crel(document.head,
        crel('style',
            'div, span{box-shadow:0 0 10px 10px black;}'
        )
    );
});

var fns = [];
function queue(fn){
    fns.push(fn);
    function start(){
        reset();
        var next = fns.shift();
        if(next){
            next(start);
        }
    }
    if(document.body){
        start();
    }else{
        window.addEventListener('load', start);
    }
}

test('scrolls into view, 1 deep', function(t) {
    var target;

    t.plan(1);

    queue(function(next){

        crel(document.body,
            crel('div', {'style':'height:5000px;'},
                target = crel('span', {'style':'position:absolute; top:2500px;'})
            )
        );

        scrollIntoView(target, function(){
            t.ok(
                target.getBoundingClientRect().top < window.innerHeight,
                'target was in view'
            );
            next();
        });
    });
});

test('scrolls into view, 2 deep', function(t) {
    var target;

    t.plan(1);

    queue(function(next){

        crel(document.body,
            crel('div', {'style':'position:relative; height:5000px; overflow: scroll;'},
                crel('div', {'style':'position:relative; font-size:20em; overflow: scroll;display:inline-block'},
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    target = crel('span', {'style':'position:absolute; top:50%; left: 50%;'})
                )
            )
        );

        scrollIntoView(target, function(){
            t.ok(
                target.getBoundingClientRect().top < window.innerHeight &&
                target.getBoundingClientRect().left < window.innerWidth,
                'target was in view'
            );
            next();
        });
    });
});

test('hijack', function(t) {
    var target1,
        target2;

    t.plan(2);

    queue(function(next){

        crel(document.body,
            crel('div', {'style':'position:relative; height:5000px; overflow: scroll;'},
                crel('div', {'style':'position:relative; font-size:20em; overflow: scroll;display:inline-block'},
                    target1 = crel('span', {'style':'position:absolute; top:75%; left: 75%; box-shadow: 0 0 10px 10px red;'}),
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE',
                    target2 = crel('span', {'style':'position:absolute; top:25%; left: 25%; box-shadow: 0 0 10px 10px green;'})
                )
            )
        );

        scrollIntoView(target1, function(){
            t.pass();
        });

        setTimeout(function(){

            scrollIntoView(target2, function(){
                t.ok(
                    target2.getBoundingClientRect().top < window.innerHeight &&
                    target2.getBoundingClientRect().left < window.innerWidth,
                    'target2 was in view'
                );
                next();
            });

        }, 500);
    });
});

test('invalid target', function(t) {
    var target;

    t.plan(1);

    queue(function(next){

        crel(document.body,
            crel('div', {'style':'position:relative; height:5000px; overflow: scroll;'},
                crel('div', {'style':'position:relative; font-size:20em; overflow: scroll;display:inline-block'},
                    target = crel('span', {'style':'position:absolute; top:75%; left: 75%; box-shadow: 0 0 10px 10px red;'}),
                    crel('div', {style: 'white-space:nowrap;'}, 'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE'),
                    crel('div', {style: 'white-space:nowrap;'}, 'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE'),
                    crel('div', {style: 'white-space:nowrap;'}, 'TEXT-AND-THAT-TO-MAKE-STUFF-HELA-WIDE')
                )
            )
        );

        scrollIntoView(
            target, 
            {
                validTarget: function(target){
                    return target !== window;
                }
            },
            function(){
                t.pass();
            }
        );
    });
});