
 xjsfl.init(this);
clear();
function elementCallback(element, index, elements, context){	
	if(element.name == "text" && element.elementType != "text"){
			Superdoc.selection.select.none();
			context.select();
		if(Superdoc.selection.elements.length == 1 ){
			

			Superdoc.selection.edit.breakApart();
			trace("Done: ", context.item.timeline.name, element);

		}
		else{
			trace("Can't do :", context.item.timeline.name, element);
		}

	}


	// trace(context.item.timeline.name);
	// inspect(element);
}
fl.showIdleMessage(false);

	Iterators.documents(true, null, null, null, null, elementCallback);
fl.showIdleMessage(true);

alert("Completed");


/////////////////////////////////////////////////////
