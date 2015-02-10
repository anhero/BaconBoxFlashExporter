xjsfl.init(this);
clear();

load('libraries/Symbol.jsfl')

fl.showIdleMessage(false);

var items = $$(':selected').elements
var elementList = new Array();

trace("Parent  -- Child");
trace("----------------");

Iterators.items($$(':symbol').elements, null, null, null, elementCB);

if(elementList.length == 0) trace("No instance found.");
fl.showIdleMessage(true);



function elementCB(element, index, elements, context){
    if(element && element.libraryItem && element.libraryItem.name == items[0].name) {
        trace(Symbol.getShortName(context.item.name)  + " -- " + Symbol.getShortName(element.libraryItem.name));
        if(elementList.indexOf(Symbol.getShortName(element.libraryItem.name)) == -1)elementList.push(Symbol.getShortName(element.libraryItem.name));
    }
}