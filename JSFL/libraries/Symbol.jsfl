load('utilities.jsfl')
load('BaconBox.jsfl')

Symbol = {
	getShortName:function(name){
    	return name.substr(name.lastIndexOf('/') + 1);
	},

	 getSymbolName:function(prefix){

	    var name;
	    do{
	        name = "symbol" + Symbol.getID();
	        if(prefix) name = prefix +name;
	    }while($$(name).elements.length > 0);
	    return Utilities.PutToAZ(name);
	},
	getID: Utilities.counter(),
	getTextureLinkID: Utilities.counter(),
	getSymbolLinkID: Utilities.counter(),

	getTextureAutoLinkageName:function(){
		return Symbol.getAutoLinkageLinkageName(false);
	},

	getSymbolAutoLinkageName:function(){
		return Symbol.getAutoLinkageLinkageName(true);
	},

	getAutoLinkageLinkageName:function(isSymbol){
		var suffix;
	    if(isSymbol){
	        suffix = '_SYMBOL_'+ Symbol.getSymbolLinkID();
	    }
	    else{
	        suffix = '_TEXTURE_'+ Symbol.getTextureLinkID();
	    }
	    return Utilities.PutToAZ(Superdoc.file.properties.name.split('.')[0] + suffix).toUpperCase();
	},

	linkItem: function(item, linkageName, isTextfield){
        if(! Symbol.isExportedForBaconBox(item)){
            item.linkageExportForAS = true;

            if(linkageName)item.linkageClassName = linkageName

            if(isTextfield){
           		item.linkageBaseClass = BaconBox.TextFieldBaseClass;
            }
            else{
            	item.linkageBaseClass = BaconBox.MovieClipBaseClassName;
            }
            item.linkageExportInFirstFrame = true;
        }
	},

	isExportedForBaconBox: function(item){
		return ( item.linkageExportForAS && (item.linkageBaseClass == BaconBox.MovieClipBaseClassName || item.linkageBaseClass ==  BaconBox.TextFieldBaseClass));
	}, 

	getDuplicatesInOpenedDocuments: function(){
		var linkageNames = {}
		var duplicateLinkageName = {}

		//Ugly iteration hack because xjsf iterator crash on items callback when there is fonts in the library
		function documentCallback(document, index, documents, context){	
			$$('*', null, document).each(function (item, index, items){	
				if((! item.linkageExportForAS) || (! item.linkageClassName)) return;
				var duplicateObject = {document: context.dom, item: item};

				if(linkageNames[item.linkageClassName]){
					if(! (item.linkageClassName in duplicateLinkageName)){
						duplicateLinkageName[item.linkageClassName] = {duplicates:[linkageNames[item.linkageClassName]], linkageName: item.linkageClassName};
					}
					duplicateLinkageName[item.linkageClassName].duplicates.push(duplicateObject);
				}
				linkageNames[item.linkageClassName] = duplicateObject;
			});
		}
		Iterators.documents(null, documentCallback);

		return duplicateLinkageName;
		
	}, 

}


