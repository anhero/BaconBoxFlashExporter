xjsfl.init(this);
clear();
var selector = prompt("Enter an xjsfl selector");
var path = prompt("Enter destination path.");

$$(selector).each( 	
	 function(item, index, items){ 
	 	// trace(item.name)
	 fl.getDocumentDOM().library.moveToFolder(path, item.name); 
 });

