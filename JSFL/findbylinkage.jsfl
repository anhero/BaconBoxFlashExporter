xjsfl.init(this);
clear();

var linkageName = prompt('Linkage name');

Iterators.items($$(':movieclip').elements, itemCallBack, null, null, null);


Superdoc.selection.select.none();

alert("Completed");





function itemCallBack(item, index, items, context){
    if(item.linkageClassName && item.linkageClassName == linkageName){
    	trace(item.name);
    }
}
 



