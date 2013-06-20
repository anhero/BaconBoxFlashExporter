xjsfl.init(this);
clear();
var getID = counter();
var existingInstanceName = new Array()


var classToRename;
var instanceName = prompt("Enter the instance name.");
if(instanceName) classToRename = prompt("Enter the class name.");
var classToRenameArray = classToRename.split(';');
if(instanceName && classToRename){
  Iterators.items($$(':symbol').elements, null, null, null, elementPrepareInstanceNameCollection);
  Iterators.items($$(':symbol').elements, null, null, null, elementCB);
}

function counter(){
    var x = 0;
    return function increment(){
        x +=1;
        return x;
    }
}


function getInstanceName(prefix){
     var name;
    do{
        name = prefix + getID();
    }while(existingInstanceName.indexOf(name) != -1);
    return name;
}

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
  for(var i = 0; i < classToRenameArray.length; i++){
    var className = classToRenameArray[i];
    if(element.name == instanceName) {
        if(element.libraryItem.shortName == className){
          var newName =  getInstanceName(element.name);
          existingInstanceName.push(newName);
          trace("renaming " + element.name + " in " +  context.item.shortName + " of type " + element.libraryItem.shortName + " to " + newName);
          element.name = newName;
        }
    }
    
  }
    
}

function elementPrepareInstanceNameCollection(element, index, elements, context)
{
    existingInstanceName.push(element.name);
}