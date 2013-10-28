

function publishWithJsonOpenedDocument(path){
	function documentCallback(document, index, documents, context){	

		publishWithJson(document, path);
	}
	Iterators.documents(true, documentCallback);
}
function publishWithJson(document, path){
		var textureNames = [];
		var jsonExport = null;
		
	var swfFile = new File(document.getSWFPathFromProfile());
	var swfPath = swfFile.path 
	var jsonFilePath = swfPath.substring(0, swfPath.lastIndexOf('.')) + ".json";
	var jsonFile = new File(jsonFilePath);
	if(path){
		var folder = new Folder(path);
		if(folder.path != jsonFile.parent.path){
			jsonFilePath = folder.path + jsonFile.name;
			jsonFile = new File(jsonFilePath);
			swfPath = folder.path + swfFile.name
			swfFile = new File(swfPath);
		}
	} 


	$$('/*/Texture:folder',null, document).each(textureFoldersCallBack);
	$$('/*/Symbol:folder',null, document).each(symbolFoldersCallBack);


	if(jsonFile.exists){
	    jsonExport = JSON.decode(jsonFile.contents);
	    for each(textureName in jsonExport.textureNames){
	        if(textureNames.indexOf(textureName) == -1){
	            delete jsonExport.textureAtlas[textureName];
	            jsonExport.textureNames.splice(jsonExport.textureNames.indexOf(textureNames), 1);
	        }
	        else{
	            jsonExport.textureAtlas[textureName].symbols =[];
	            jsonExport.textureAtlas[textureName].textures =[];
	            jsonExport.textureAtlas[textureName].opaqueTextures = [];
	        }
	    }   
	}
	else{
	    jsonExport = {swfName:getPublishingName(), textureNames:[], textureAtlas:{}};
	}

	for each (textureName in textureNames){
	    if(!(textureName in jsonExport.textureAtlas)){
	        jsonExport.textureAtlas[textureName] = {textureName:textureName, symbols:[], textures:[], opaqueTextures:[]};
	    }
	    if(jsonExport.textureNames.indexOf(textureName) == -1){
	        jsonExport.textureNames.push(textureName);
	    }
	}


	$$('/*/Texture/*:movieclip',null, document).each(textureCallBack);
	$$('/*/Symbol/*:movieclip',null, document).each(symbolCallBack);

	jsonFile.write(JSON.encode(jsonExport));


	document.exportSWF(swfFile.uri)




function getPublishingName(){
    var profile = new PublishProfile();
    profile.load();
    return  getFullSWFPath(profile.file.flashPath); 
}

function getFullSWFPath(swfPath) {
    if(swfPath.charAt(0)== '/' || swfPath.charAt(1) == ':'){
        return swfPath;
    }
    else{
        var docPath = Superdoc.file.properties.path;
        var directorySeparator = '/';
        if( docPath.charAt(1) == ':'){
            directorySeparator = '\\'; 
        }
        var pathToSWF = docPath.substring(0, docPath.lastIndexOf(directorySeparator))
        if(Superdoc.file.properties.path.split('.').pop() == "xfl"){
            pathToSWF += directorySeparator + "..";
        }
        return  pathToSWF + directorySeparator + swfPath;
    }
}

function getAtlasNameFromFolder(fullName){
    var nameArray = fullName.split("/");
    var atlasName  = ""
    atlasName = nameArray[0].replace(/ /g, "");
    for(var i = 1; i < nameArray.length-1; i++){
        var namePart = nameArray[i].replace(/ /g, "");
       
        atlasName += "_" + namePart
    }
    return atlasName;
    
}



function getAtlasNameFromElement(fullName){
    var posTexture = fullName.lastIndexOf("Texture/");
    var posSymbol = fullName.lastIndexOf("Symbol/");
    var pos = (posSymbol < posTexture ? posTexture: posSymbol);
    var name = fullName.slice(0, pos);
    return getAtlasNameFromFolder(name);
}

function getElementName(fullName){
    var nameArray = fullName.split("/");
    return nameArray[nameArray.length-1];
    
}
function symbolFoldersCallBack(element, index, elements){
    var name = getAtlasNameFromFolder(element.name);
    if(textureNames.indexOf(name) == -1){
        textureNames.push(name);
    }
}



function textureFoldersCallBack(element, index, elements){
    var name = getAtlasNameFromFolder(element.name);
    if(textureNames.indexOf(name) == -1){
        textureNames.push(name);
    }
}

function symbolCallBack(element, index, elements){
    var name = getAtlasNameFromElement(element.name);
    jsonExport.textureAtlas[name].symbols.push(element.linkageClassName);
}



function textureCallBack(element, index, elements){
    var name = getAtlasNameFromElement(element.name);
    if(element.name.indexOf("opaque") != -1 || element.name.indexOf("Opaque") != -1){
         jsonExport.textureAtlas[name].opaqueTextures.push(element.linkageClassName);   
    }
    else {
      jsonExport.textureAtlas[name].textures.push(element.linkageClassName);   
    }
}

}
