(function(){
	
	var mathExtended = {
		
		randomRange : function ( min, max, floatVal ) {
			var t = min + ( Math.random() * (max - min) );
			t = (typeof floatVal == 'undefined') ? Math.round(t) : t.toFixed(floatVal);
			return t;
		},
		
		distance : function (x, y, x0, y0){
		    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
		},
		
		formatDecimals: function (number, places) {
			var factor = Math.pow(10, places);
			return Math.round(number * factor)/factor;
		}
		
	};
	
	for ( var key in mathExtended ) {
		Math[key] = mathExtended[key];
	};
	
})();