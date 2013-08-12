xjsfl.init(this);
clear();
jsonExport = {swfName:getPublishingName(), textureNames:[]};


if(true || $$('/*/Texture:selected:folder').elements.length + $$('/*/Symbol:selected:folder').elements.length == 0){
$$('/*/Texture:folder').each(textureFoldersCallBack);
$$('/*/Symbol:folder').each(symbolFoldersCallBack);
$$('/*/Texture/*:movieclip').each(textureCallBack);
$$('/*/Symbol/*:movieclip').each(symbolCallBack);}
else{
$$('/*/Texture:selected:folder').each(textureFoldersCallBack);
$$('/*/Symbol:selected:folder').each(symbolFoldersCallBack);
$$('/*/Texture/*:selected:movieclip').each(textureCallBack);
$$('/*/Symbol/*:selected:movieclip').each(symbolCallBack);
}

Superdoc.file.publish();


var jsonFilePath = jsonExport.swfName.substring(0, jsonExport.swfName.lastIndexOf('.')) + ".json";
var jsonFile = new File(jsonFilePath).write(JSON.encode(jsonExport));



var pathToAirExporter = 'start /B /D"C:\\Program Files (x86)\\BaconBoxTexturePacker"'
//FLfile.runCommandLine(pathToAirExporter + "  BaconBoxTexturePacker.exe " + jsonFilePath + " 1");


//var pathToAirExporter = '/Users/dupuisj/Documents/Anhero/BaconBoxTexturePacker/out/production/BaconBoxTexturePacker/BaconBoxTexturePacker.app/Contents/MacOS/BaconBoxTexturePacker&'

//FLfile.runCommandLine(pathToAirExporter + " " + jsonFilePath + " 1");


/////////////////////////////////////////////////////

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

function getMethodsAndAttribute(obj) {
  var result = [];
  for (var id in obj) {
    try {
        result.push(id + ": " + obj[id].toString());
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
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
    if(!(name in jsonExport)){
        jsonExport[name] = {textureName:name, symbols:[], textures:[], opaqueTextures:[]}
        jsonExport.textureNames.push(name);
    }
}



function textureFoldersCallBack(element, index, elements){
    var name = getAtlasNameFromFolder(element.name);
    if(!(name in jsonExport)){
        jsonExport[name] = {textureName:name, symbols:[], textures:[], opaqueTextures:[]}
        jsonExport.textureNames.push(name);
    }
}

function symbolCallBack(element, index, elements){
    var name = getAtlasNameFromElement(element.name);
    jsonExport[name].symbols.push(element.linkageClassName);
}



function textureCallBack(element, index, elements){
    var name = getAtlasNameFromElement(element.name);
    if(element.name.indexOf("opaque") == -1){
      jsonExport[name].textures.push(element.linkageClassName);   
    }
    else {
     jsonExport[name].opaqueTextures.push(element.linkageClassName);   
    }
}