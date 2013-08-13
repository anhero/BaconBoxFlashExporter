xjsfl.init(this);
clear();



Iterators.items($$(':movieclip').elements, itemCallBack, null, null, null);


Superdoc.selection.select.none();

alert("Completed");





function itemCallBack(item, index, items, context){
    if(item.linkageClassName && item.linkageClassName.indexOf(' ') != -1){
    	trace("SPACE FOUND IN LINKAGE NAME!!! " + item.name);
    }
}
 



