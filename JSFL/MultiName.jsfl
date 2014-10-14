var stuff = fl.getDocumentDOM().selection
var theName = prompt("Enter name", "");

for (var i = 0 ; i < stuff.length ; i++) {
	stuff[i].name = theName;
}