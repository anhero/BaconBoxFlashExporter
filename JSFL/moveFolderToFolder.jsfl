xjsfl.init(this);
clear();
var library =  Superdoc.containers.panel.library
var folder;
var result = false;
var elementsCollection = $$(':folder:selected');
var elements = elementsCollection.elements;

var i = 0
while(!result && i < elements.length){
    folderFinder(elements[i]);
    i++;
}

if(result){
  elementsCollection.each(function(element, index, elements){
      if(folder != element){
        library.moveToFolder(folder.name, element.name, false);
      }
    }
  );
}


Superdoc.selection.select.none();
alert("Completed");




function folderFinder(item)
{
  result = confirm ("Move to " + item.name);
  if(result){
    folder = item;
    return true;
  }
}