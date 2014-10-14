var stuff = fl.getDocumentDOM().selection
var theName = prompt("Enter name", "");
if(!theName)theName = "";
for (var i = 0 ; i < stuff.length ; i++) {
	stuff[i].name = theName;
}