xjsfl.init(this);
clear();
var library =  Superdoc.containers.panel.library

var folder = $$(':folder:selected').elements[0]
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
$$(':symbol:selected').each(
    function(element, index, elements){
        library.moveToFolder(folder.name, element.name, false);
    } );