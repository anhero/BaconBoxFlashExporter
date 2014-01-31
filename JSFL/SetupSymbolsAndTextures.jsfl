xjsfl.init(this);
clear();

load('libraries/Symbol.jsfl')
load('libraries/utilities.jsfl')
load('libraries/BaconBox.jsfl')

fl.showIdleMessage(false);

var getID = Utilities.counter();



var symbolItems = $$('/*/Symbol/*:movieclip:selected').elements
var textureItems = $$('/*/Texture/*:movieclip:selected').elements;

var scriptInProgress = true;
while(scriptInProgress){
    scriptInProgress = false;
    Iterators.items(symbolItems, symbolLinkageNameCallback, null, null, elementSymbolConvertCallback);
    Iterators.items(textureItems, textureLinkageNameCallback, null, null, null);
}


Superdoc.selection.select.none();
fl.showIdleMessage(true);

alert("Completed");




function textureLinkageNameCallback(item, index, items, context){
    if(! Symbol.isExportedForBaconBox(item)){
        Symbol.linkItem(item, Symbol.getTextureAutoLinkageName());
    }
}

function symbolLinkageNameCallback(item, index, items, context){
    if(! Symbol.isExportedForBaconBox(item)){
        Symbol.linkItem(item, Symbol.getSymbolAutoLinkageName());
    }
}



function elementSymbolConvertCallback(element, index, elements, context){
    
        if(context.layer.layerType != "normal" || context.item.linkageBaseClass == BaconBox.TextFieldBaseClass) return;
        context.layer.visible =  true;
        context.layer.locked =  false;
         if(element.elementType == "shape" || element.elementType == "instance" && element.libraryItem.itemType == "bitmap") {
             var currentSymbolName = Symbol.getTextureName(Symbol.getShortName(context.item.name) + '_');
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
             newMc.linkageClassName = Symbol.getTextureAutoLinkageName();
             newMc.linkageBaseClass = BaconBox.MovieClipBaseClassName;
             newMc.linkageExportInFirstFrame = true;
             scriptInProgress = true;
         }
    
         else if(element.elementType == "text"){
             if(context.item.linkageBaseClass == BaconBox.TextFieldBaseClass) return;
             if(element.textType != "dynamic"){
                element.textType = "dynamic"; 
                element.name = "";
             }

             var currentSymbolName = Symbol.getSymbolName(Symbol.getShortName(context.item.name) + '_');
             fl.getDocumentDOM().selectNone();
             context.select();
             if(fl.getDocumentDOM().selection.length <= 0) return;
             var tfName = element.name;
             element.name = "text"
             var newMc =  Superdoc.selection.edit.convertToSymbol("movie clip", currentSymbolName, "top left");
             var itemName = context.item.name;
             var posSymbol = itemName.lastIndexOf("Symbol/");
     
             fl.getDocumentDOM().library.moveToFolder(itemName.slice(0, posSymbol)+"Symbol", currentSymbolName); 

             newMc.linkageExportForAS = true;
             newMc.linkageClassName = Symbol.getSymbolAutoLinkageName();
             newMc.linkageBaseClass = BaconBox.TextFieldBaseClass;
             newMc.linkageExportInFirstFrame = true;

             var contextElements = context.frame.elements;
             for(var i = 0; i < contextElements.length; i++){
                if(contextElements[i].libraryItem && contextElements[i].libraryItem.name.split("/").pop() == currentSymbolName){
                    contextElements[i].name = tfName;
                }
             }
           
          scriptInProgress = true;

         }
         else{
         }
}
 



