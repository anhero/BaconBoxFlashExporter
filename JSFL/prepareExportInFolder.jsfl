xjsfl.init(this);
clear();
load('libraries/publishWithJson.jsfl')

var folder  = new Folder(fl.browseForFolderURL());
publishWithJsonOpenedDocument(folder.path);

alert("Completed");


/////////////////////////////////////////////////////

