xjsfl.init(this);
clear();

var texturename = prompt("Enter texture name.", Superdoc.file.properties.name.split('.')[0]);
	if(texturename){
	fl.getDocumentDOM().library.newFolder(texturename);
	fl.getDocumentDOM().library.newFolder(texturename + "/Symbol");

	fl.getDocumentDOM().library.newFolder(texturename + "/Texture");
	fl.getDocumentDOM().library.newFolder(texturename + "/Texture/Opaque");
}

