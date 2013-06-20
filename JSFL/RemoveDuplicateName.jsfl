xjsfl.init(this);
clear();

var getID = counter();
var WhatEvID = counter();

var nameCache = new Array()
Iterators.items($$(':symbol').elements, itemLinkageCallback, null, null, null);


Iterators.items($$(':symbol').elements, removeDuplicateName, null, null, null);
Iterators.items($$(':symbol').elements, removeDuplicateLinkage, null, null, null);

Iterators.items($$(':symbol').elements, itemLinkageCallback, null, null, null);


alert("done");
Superdoc.selection.select.none();


function counter(){
    var x = 0;
    return function increment(){
        x +=1;
        return x;
    }
}

function removeDuplicateName(item, index, items, context){
    if(nameCache.indexOf(item.shortName.toLowerCase()) == -1){
        nameCache.push(item.shortName.toLowerCase())
    }
    else{
        var newName;
        do{
             newName = item.shortName +"_"+ getID();
             
        }while(nameCache.indexOf(newName.toLowerCase()) != -1)
        
        item.name = newName.toLowerCase();
        nameCache.push(item.shortName);
    }
       


}

function removeDuplicateLinkage(item, index, items, context){
       if(!item.linkageExportForAS) item.linkageExportForAS  = true;
       item.linkageClassName = "Whatev_"+WhatEvID();

}

function itemLinkageCallback(item, index, items, context){
    item.linkageExportForAS  = false;
}
