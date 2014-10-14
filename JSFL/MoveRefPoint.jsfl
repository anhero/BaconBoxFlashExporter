xjsfl.init(this);
load('libraries/Utilities.jsfl')
clear();

var posX = prompt("New X position", Superdoc.appearance.properties.width/2);
var posY = prompt("New Y position", Superdoc.appearance.properties.height/2);
var elements = Superdoc.selection.elements;

var length = elements.length;
for (var i = 0; i < length; i++) {
  element = elements[i]
  Utilities.MoveElementRefPoint(element, posX - element.x, posY - element.y);
}
trace('Done!')
