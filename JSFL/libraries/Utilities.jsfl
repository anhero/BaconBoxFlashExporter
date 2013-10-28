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
	}
}


