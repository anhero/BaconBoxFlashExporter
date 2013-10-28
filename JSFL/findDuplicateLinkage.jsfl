xjsfl.init(this);
clear();
load('libraries/Symbol.jsfl')

var duplicateLinkageName = Symbol.getDuplicatesInOpenedDocuments();


for (var item in duplicateLinkageName){
	var documents = "";
	var arrayOfDuplicate = duplicateLinkageName[item].duplicates;

	for(var index in arrayOfDuplicate){
		documents += arrayOfDuplicate[index].document.name + "\n"
	}
	trace(item + " is duplicate in :\n" + documents);
	trace("---------------------------------");
}

alert("done!");
