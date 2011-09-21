define(["libs/Backbone.Framework"], 

function() {
    
	var Style = Backbone.Model.extend({

		defaults: {
			fillStyle: '#eee',
			strokeStyle: '#000',
			lineWidth: 1,
			shadowColor : '',
			shadowBlur : 0,
			shadowOffsetX : 0,
			shadowOffsetY : 0,
			centred: true
		}

	});
	
	return Style;
	
});