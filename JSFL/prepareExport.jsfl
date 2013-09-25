xjsfl.init(this);
clear();
var publishingName = getPublishingName();
var jsonExport = null;

var jsonFilePath = publishingName.substring(0, publishingName.lastIndexOf('.')) + ".json";
var jsonFile = new File(jsonFilePath);
var textureNames = [];



if(true || $$('/*/Texture:selected:folder').elements.length + $$('/*/Symbol:selected:folder').elements.length == 0){
$$('/*/Texture:folder').each(textureFoldersCallBack);
$$('/*/Symbol:folder').each(symbolFoldersCallBack);
}
else{
$$('/*/Texture:selected:folder').each(textureFoldersCallBack);
$$('/*/Symbol:selected:folder').each(symbolFoldersCallBack);
}

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


if(true || $$('/*/Texture:selected:folder').elements.length + $$('/*/Symbol:selected:folder').elements.length == 0){
$$('/*/Texture/*:movieclip').each(textureCallBack);
$$('/*/Symbol/*:movieclip').each(symbolCallBack);
}
else{
$$('/*/Texture/*:selected:movieclip').each(textureCallBack);
$$('/*/Symbol/*:selected:movieclip').each(symbolCallBack);
}



jsonFile.write(JSON.encode(jsonExport));


Superdoc.file.publish();



// function getMethodsAndAttribute(obj) {
//   var result = [];
//   for (var id in obj) {
//     try {
//         result.push(id + ": " + obj[id].toString());
//     } catch (err) {
//       result.push(id + ": inaccessible");
//     }
//   }
//   return result;
// }
// trace(getMethodsAndAttribute(jsonFile));




// var pathToAirExporter = 'start /B /D"C:\\Program Files (x86)\\BaconBoxTexturePacker"'
//FLfile.runCommandLine(pathToAirExporter + "  BaconBoxTexturePacker.exe " + jsonFilePath + " 1");


//var pathToAirExporter = '/Users/dupuisj/Documents/Anhero/BaconBoxTexturePacker/out/production/BaconBoxTexturePacker/BaconBoxTexturePacker.app/Contents/MacOS/BaconBoxTexturePacker&'

//FLfile.runCommandLine(pathToAirExporter + " " + jsonFilePath + " 1");



alert("Completed");


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