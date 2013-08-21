

var newEntityBaseClassName = "BaconBox.EntityWrapper.EntityHolderMovieClip"
var newEntityTextFieldaseClassName = "BaconBox.EntityWrapper.EntityHolderTextField"



Iterators.items($$(':selected').elements, linkageNameCallback, null, null, null);



function linkageNameCallback(item, index, items, context){
        if(! item.linkageExportForAS || ! (item.linkageBaseClass == newEntityBaseClassName || item.linkageBaseClass == newEntityTextFieldaseClassName)){
            item.linkageExportForAS = true;
            // item.linkageClassName = getLinkageName(false)

            item.linkageBaseClass = newEntityBaseClassName;
            item.linkageExportInFirstFrame = true;
        }
}

alert("Completed");
