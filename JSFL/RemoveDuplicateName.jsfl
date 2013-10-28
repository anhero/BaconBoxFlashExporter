xjsfl.init(this);
clear();

load('libraries/utilities.jsfl')

var getID = Utilities.counter();
var WhatEvID = Utilities.counter();

var nameCache = new Array()
Iterators.items($$(':symbol').elements, itemLinkageCallback, null, null, null);


Iterators.items($$(':symbol').elements, removeDuplicateName, null, null, null);
Iterators.items($$(':symbol').elements, removeDuplicateLinkage, null, null, null);

Iterators.items($$(':symbol').elements, itemLinkageCallback, null, null, null);


alert("done");
Superdoc.selection.select.none();





function removeDuplicateName(item, index, items, context){
    if(nameCache.indexOf(Symbol.getShortName(item.name).toLowerCase()) == -1){
        nameCache.push(Symbol.getShortName(item.name).toLowerCase())
    }
    else{
        var newName;
        do{
             newName = Symbol.getShortName(item.name) +"_"+ getID();
             
        }while(nameCache.indexOf(newName.toLowerCase()) != -1)
        
        item.name = newName.toLowerCase();
        nameCache.push(Symbol.getShortName(item.name));
    }
       


}

function removeDuplicateLinkage(item, index, items, context){
       if(!item.linkageExportForAS) item.linkageExportForAS  = true;
       item.linkageClassName = "Whatev_"+WhatEvID();

}

function itemLinkageCallback(item, index, items, context){
    item.linkageExportForAS  = false;
}
