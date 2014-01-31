
NameRegister = {
	linkageNames: new Array(),
	isInitialized:false,
	initialize:function(){
		if(NameRegister.isInitialized)return;
		NameRegister.isInitialized = true;
    	Iterators.items($$(':movieclip').elements, NameRegister.itemCallBack, null, null, null);
	},
	linkageIsAvailable:function(name){
		return NameRegister.linkageNames.indexOf(name) == -1;
	},
	pushLinkageName:function(name){
	    NameRegister.linkageNames.push(name);
	},
	itemCallBack:function(item, index, items, context){
	    NameRegister.linkageNames.push(item.linkageClassName);
	}
}











 



