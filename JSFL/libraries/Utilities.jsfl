Utilities = {
	counter: function (startAt){
	    var x = 0;
	    if(startAt) x = startAt;
	    return function increment(){
	        x +=1;
	        return x;
	    }
	},

	PutToAZ: function (s){
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
	},
	CenterSelection:function(onXAxis,onYAxis){
		onXAxis = (typeof(onXAxis) !== 'undefined' ? onXAxis: true);
		onYAxis = (typeof(onYAxis) !== 'undefined' ? onYAxis: true);


		var rect = Superdoc.selection.transform.rect;

		var pos = {x:0,y:0};
		if(onXAxis){
			var width = (rect.right - rect.left);
			pos.x = (-0.5 * width) - rect.left;	
		}

		if(onYAxis){
			var height = (rect.bottom - rect.top);
			pos.y = (-0.5 * height) - rect.top;	
		}
		clear();
		Superdoc.selection.transform.moveBy(pos);





	},

	MoveElementRefPoint:function(element, diffX,diffY){

		element.x += diffX;
		element.y += diffY;

		Iterators.layers(element, null, null, function(element, index, elements, context){
			element.x -= diffX;
			element.y -= diffY;
		});
	}
}


