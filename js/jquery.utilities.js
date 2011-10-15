var toString = Object.prototype.toString;
jQuery.extend(jQuery, {	
	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},
	valueInArray: function(oArray, value){
		if(jQuery.isArray(oArray)){
			for( var i = 0; i < oArray.length; i++ ) {
				if( oArray[i] === value ) { 
					return i; 
				}
			}
			return -1;
		}else{
			throw new Error("This extension jQuery - valueInArray - oArray you need to be provided and is an array");
		}
	},
	uniqueValues: function(aObject){
		if(jQuery.isArray(aObject)){
			var aux = [];
			for(var i = 0; i < aObject.length ; i++ ) {
				if( jQuery.valueInArray(aux, aObject[i] ) < 0 ) { 
					aux.push( aObject[i] ); 
				}
			}
			return aux;
		}else{
			throw new Error("This extension jQuery - uniqueValues - aObject you need to be provided and is an array");
		}
	}
});
