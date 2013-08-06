xjsfl.init(this);
clear();

var getID = counter();
var linkageID = counter();
var newSymbolName ="symbol"
var newEntityBaseClassName = "BaconBox.EntityWrapper.EntityHolderMovieClip"
var newEntityTextFieldaseClassName = "BaconBox.EntityWrapper.EntityHolderTextField"

var symbolItems = $$('/*/Symbol/*:movieclip:selected').elements
var textureItems = $$('/*/Texture/*:movieclip:selected').elements;

Iterators.items(symbolItems, itemLinkageCallback, null, null, elementSymbolConvertCallback);
Iterators.items(textureItems, itemLinkageCallback, null, null, null);


Superdoc.selection.select.none();
alert("Completed");


function counter(){
    var x = 0;
    return function increment(){
        x +=1;
        return x;
    }
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
    return (name.substr(name.lastIndexOf('/') + 1));
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


function itemLinkageCallback(item, index, items, context){
        if(! item.linkageExportForAS || ! (item.linkageBaseClass == newEntityBaseClassName || item.linkageBaseClass == newEntityTextFieldaseClassName)){
            item.linkageExportForAS = true;
            var name = getShortName(item.name);
            item.linkageClassName = PutToAZ(name);

            item.linkageBaseClass = newEntityBaseClassName;
            item.linkageExportInFirstFrame = true;


        }
    }
  


function elementSymbolConvertCallback(element, index, elements, context)
{
    
        if(context.layer.layerType != "normal" || context.item.linkageBaseClass == newEntityTextFieldaseClassName) return;
        
        context.layer.locked=  false;
         if(element.elementType == "shape" || element.elementType == "instance" && element.libraryItem.itemType == "bitmap") {
             var currentSymbolName = getSymbolName(getShortName(context.item.name) + '_');
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
             var currentSymbolName = getSymbolName(getShortName(context.item.name) + '_');
             fl.getDocumentDOM().selectNone();
             context.select();
             if(fl.getDocumentDOM().selection.length <= 0) return;
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
             
             
         }
         else{
             
         }
}
 



