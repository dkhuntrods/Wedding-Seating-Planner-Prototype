define(["./PhysicalShape", "libs/Backbone.Framework"], 

function(PhysicalShape) {
    
	var Grid = PhysicalShape.extend({
		
		defaults: _({ 	
			colWidth : 1,
			rowHeight : 1
		}).extend(PhysicalShape.prototype.defaults),


		toJSON : function() {

			var a = this.attributes;
			return {
				"id" : this.id,
				"x": a.x,
				"y": a.y,
				"width": a.width,
				"height": a.height,
				"colWidth": a.colWidth,
				"colHeight": a.colHeight,
				"rotation": a.rotation,
				"name": a.name,
				"type": _.clone(a.type),
				"order": a.order,
				"buffer": a.buffer,
				"footprintWidth": a.footprintWidth,
				"footprintHeight": a.footprintHeight

			};
	    }
		
	});
	
	return Grid;
	
});