xjsfl.init(this);
clear();


function getDocumentPath(docPath){
	if(!docPath){
		docPath = Superdoc.file.properties.path;
	}
	var file = new File(docPath);
	if(file.extension == "xfl"){
		file = file.parent.parent;
	}
	else{
		file = file.parent;
	}
	return file.path;
}


function openAllFileInFolder(path){
	folder = new Folder(path);
	folder.each(function(subfolder, index){
		subfolder.each(function(file, index){
			if(file.extension == "xfl")fl.openDocument(file.uri);
		}, "files");
	}, "folders");	

	folder.each(function(file, index){
		if(file.extension == "fla")fl.openDocument(file.uri);
	}, "files");

}

function closeAllFile(){
Iterators.documents(true, function (document, index, documents, context){	
	document.close();
	});
}