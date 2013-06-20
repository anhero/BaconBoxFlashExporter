xjsfl.init(this);
clear();
var instanceName = prompt("Enter the instance name.");
var elementList = new Array();

Iterators.items($$(':symbol').elements, null, null, null, elementCB);
trace(elementList.join(';'));
if(elementList.length == 0) trace("No instance found.");

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

function elementCB(element, index, elements, context){
    if(element.name == instanceName) {
      
        trace(context.item.shortName  + " -- " + element.libraryItem.shortName);
        if(elementList.indexOf(element.libraryItem.shortName) == -1)elementList.push(element.libraryItem.shortName);
    }
}