xjsfl.init(this);
clear();


Iterators.items($$(':symbol').elements, itemLinkageCallback, null, null, null);

alert("done");
Superdoc.selection.select.none();




function itemLinkageCallback(item, index, items, context){
    item.linkageExportForAS  = false;

}

