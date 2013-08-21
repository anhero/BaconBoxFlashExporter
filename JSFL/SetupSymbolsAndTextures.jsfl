xjsfl.init(this);
clear();

fl.showIdleMessage(false);

var getID = counter();

var getTextureLinkID = counter();
var getSymbolLinkID = counter();

var newSymbolName ="symbol"
var newEntityBaseClassName = "BaconBox.EntityWrapper.EntityHolderMovieClip"
var newEntityTextFieldaseClassName = "BaconBox.EntityWrapper.EntityHolderTextField"

var symbolItems = $$('/*/Symbol/*:movieclip:selected').elements
var textureItems = $$('/*/Texture/*:movieclip:selected').elements;

Iterators.items(symbolItems, symbolLinkageNameCallback, null, null, elementSymbolConvertCallback);
Iterators.items(textureItems, textureLinkageNameCallback, null, null, null);


Superdoc.selection.select.none();
fl.showIdleMessage(true);

alert("Completed");


function counter(){
    var x = 0;
    return function increment(){
        x +=1;
        return x;
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

function getSymbolName(prefix){
    var name;
    do{
        name = newSymbolName + getID();
        if(prefix) name = prefix +name;
    }while($$(name).elements.length > 0);
    return name;
}


function getShortName(name){
    return name.substr(name.lastIndexOf('/') + 1);
}

function PutToAZ(s){
 for (var i = 0 ; i < s.length ; i++) {
  //if((s.charCodeAt(i) == 32)){
   //continue;
  //}
  if(!((s.charCodeAt(i) >= 48 && s.charCodeAt(i) <= 57) || (s.charCodeAt(i) >= 97 && s.charCodeAt(i) <= 122) || 
   (s.charCodeAt(i) >= 65 && s.charCodeAt(i) <= 90) || (s.charCodeAt(i) == 95))) {
   s = s.split(s.substr(i,1)).join("_");
  }
 }
 return s;
}

function getLinkageName(isSymbol){
    var suffix;
    if(isSymbol){
        suffix = '_SYMBOL_'+ getSymbolLinkID();
    }
    else{
        suffix = '_TEXTURE_'+ getTextureLinkID();
    }
    return PutToAZ(Superdoc.file.properties.name.split('.')[0] + suffix).toUpperCase();
}

function textureLinkageNameCallback(item, index, items, context){
        if(! item.linkageExportForAS || ! (item.linkageBaseClass == newEntityBaseClassName || item.linkageBaseClass == newEntityTextFieldaseClassName)){
            item.linkageExportForAS = true;
            item.linkageClassName = getLinkageName(false)

            item.linkageBaseClass = newEntityBaseClassName;
            item.linkageExportInFirstFrame = true;
        }
}

function symbolLinkageNameCallback(item, index, items, context){
        if(! item.linkageExportForAS || ! (item.linkageBaseClass == newEntityBaseClassName || item.linkageBaseClass == newEntityTextFieldaseClassName)){
            item.linkageExportForAS = true;
            item.linkageClassName = getLinkageName(true)

            item.linkageBaseClass = newEntityBaseClassName;
            item.linkageExportInFirstFrame = true;


        }
}



function elementSymbolConvertCallback(element, index, elements, context)
{
    
        if(context.layer.layerType != "normal" || context.item.linkageBaseClass == newEntityTextFieldaseClassName) return;
        context.layer.visible =  true;
        context.layer.locked =  false;
         if(element.elementType == "shape" || element.elementType == "instance" && element.libraryItem.itemType == "bitmap") {
             var currentSymbolName = PutToAZ(getSymbolName(getShortName(context.item.name) + '_'));
             fl.getDocumentDOM().selectNone();
             context.select();
             if(fl.getDocumentDOM().selection.length <= 0) return;

             var newMc =  Superdoc.selection.edit.convertToSymbol("movie clip", currentSymbolName, "top left");
             var itemName = context.item.name;
             var posSymbol = itemName.lastIndexOf("Symbol/");
             
             fl.getDocumentDOM().library.moveToFolder(itemName.slice(0, posSymbol) + "Texture", currentSymbolName); 
     
             //fl.getDocumentDOM().enterEditMode('');
             //fl.getDocumentDOM().distributeToLayers();
             newMc.linkageExportForAS = true;
             newMc.linkageClassName = currentSymbolName;
             newMc.linkageBaseClass = newEntityBaseClassName;
             newMc.linkageExportInFirstFrame = true;
             
         }
    
         else if(element.elementType == "text"){
             if(context.item.linkageBaseClass == newEntityTextFieldaseClassName) return;
             if(element.textType != "dynamic"){
                element.textType = "dynamic"; 
                element.name = "";
             }

             var currentSymbolName = PutToAZ(getSymbolName(getShortName(context.item.name) + '_'));
             fl.getDocumentDOM().selectNone();
             context.select();
             if(fl.getDocumentDOM().selection.length <= 0) return;
             var tfName = element.name;
             element.name = "text"
             var newMc =  Superdoc.selection.edit.convertToSymbol("movie clip", currentSymbolName, "top left");
             var itemName = context.item.name;
             var posSymbol = itemName.lastIndexOf("Symbol/");
     
             fl.getDocumentDOM().library.moveToFolder(itemName.slice(0, posSymbol)+"Symbol", currentSymbolName); 
             //fl.getDocumentDOM().enterEditMode('');
             //fl.getDocumentDOM().distributeToLayers();
             newMc.linkageExportForAS = true;
             newMc.linkageClassName = currentSymbolName;
             newMc.linkageBaseClass = newEntityTextFieldaseClassName;
             newMc.linkageExportInFirstFrame = true;

             var contextElements = context.frame.elements;
             for(var i = 0; i < contextElements.length; i++){
                if(contextElements[i].libraryItem && contextElements[i].libraryItem.name.split("/").pop() == currentSymbolName){
                    contextElements[i].name = tfName;
                }
             }
           
             
         }
         else{
         }
}
 



