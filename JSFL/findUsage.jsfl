xjsfl.init(this);
clear();
fl.showIdleMessage(false);

var items = $$(':selected').elements

var elementList = new Array();

Iterators.items($$(':symbol').elements, null, null, null, elementCB);

trace(elementList.join(';'));
if(elementList.length == 0) trace("No instance found.");
fl.showIdleMessage(true);

function getMethodsAndAttribute(obj) {
  var result = [];
  for (var id in obj) {
    try {
        result.push(id + ": " + obj[id].toString());
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

function getMethods(obj) {
  var result = [];
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        result.push(id + ": " + obj[id].toString());
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

function getShortName(name){
    return name.substr(name.lastIndexOf('/') + 1);
}
function elementCB(element, index, elements, context){
    if(element && element.libraryItem && element.libraryItem.linkageClassName == items[0].linkageClassName) {
      
        trace(getShortName(context.item.name)  + " -- " + getShortName(element.libraryItem.name));
        if(elementList.indexOf(getShortName(element.libraryItem.name)) == -1)elementList.push(getShortName(element.libraryItem.name));
    }
}