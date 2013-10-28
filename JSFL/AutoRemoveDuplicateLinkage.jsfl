xjsfl.init(this);
clear();
load('libraries/Symbol.jsfl')
load('libraries/utilities.jsfl')

var confirmation = confirm("Are you sure you want to proceed? This script will rename any duplicate linkage name in the opened documents.")


if(confirmation){
	var duplicateLinkageName = Symbol.getDuplicatesInOpenedDocuments();
	var suffix = prompt('Enter a random suffix');
	var getID = Utilities.counter();

	for (var item in duplicateLinkageName){
		var documents = "";
		var arrayOfDuplicate = duplicateLinkageName[item].duplicates;

		for(var index in arrayOfDuplicate){
			arrayOfDuplicate[index].item.linkageClassName = arrayOfDuplicate[index].document.name + '_' + suffix + '_' + getID();
		}

	}

	alert("done!");
}