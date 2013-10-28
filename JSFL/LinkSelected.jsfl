xjsfl.init(this);

load('libraries/Symbol.jsfl')


var newEntityBaseClassName = "BaconBox.EntityWrapper.EntityHolderMovieClip"
var newEntityTextFieldaseClassName = "BaconBox.EntityWrapper.EntityHolderTextField"



Iterators.items($$(':selected').elements, linkageNameCallback, null, null, null);



function linkageNameCallback(item, index, items, context){
           Symbol.linkItem(item);
}

alert("Completed");
