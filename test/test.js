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


var oldTest = test;

test = function(name, callback){
    window.addEventListener('load', function(){
        oldTest(name, function(t){
            var oldEnd = t.end;
            t.end = function(){
                reset();
                oldEnd.apply(t);
            }
            callback(t);
        });
    });
}

test('scrolls into view, 1 deep', function(t) {
    var target;

    crel(document.body,
        crel('div', {'style':'height:5000px;'},
            target = crel('span', {'style':'position:absolute; top:2500px;'})
        )
    );

    t.plan(1);

    scrollIntoView(target);

    t.ok(
        target.getBoundingClientRect().top < window.innerHeight,
        'target was in view'
    );
    t.end();
});


test('scrolls into view, 2 deep', function(t) {
    var target,
        wrapper;

    crel(document.body,
        wrapper = crel('div', {'style':'height:5000px;'},
            crel('div', {'style':'width:5000px; height:100%;'},
                target = crel('span', {'style':'position:absolute; top:2500px; left: 2500px;'})
            )
        )
    );

    t.plan(1);

    scrollIntoView(target);

    t.ok(
        target.getBoundingClientRect().top < window.innerHeight &&
        target.getBoundingClientRect().left < window.innerWidth,
        'target was in view'
    );
    t.end();
});
