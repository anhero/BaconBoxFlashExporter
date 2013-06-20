xjsfl.init(this);
clear();

var count = counter();

function counter(){
    var x = 0;
    return function increment(){
        x +=1;
        return x;
    }
}
var items = $$('/*/Symbol/*:movieclip').each(function(element, index, elements){ trace("var elementReference"+ count() + ":" + element.linkageClassName + ";"); });