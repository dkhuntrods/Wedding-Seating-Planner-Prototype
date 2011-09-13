ShapeList = Backbone.Collection.extend({
	model: Furniture,
	
	initialize: function(models, attrs) {
		this.units = attrs.units;
		_.bindAll(this, 'parse', 'getTypeById', 'nextOrder');
	},
	
	nextOrder: function() {
		if (!this.length) return 1;
      	return this.last().get('order') + 1;
    },

	comparator: function(table) {
	    return table.get('order');
	},
	
	parse: function(responses) {
		
		_(responses).each( function(shape) {
			shape.type = this.getTypeById(shape.type.id);
			shape.units = this.units;
			_(shape.seats).each( function(seat) {				
				seat.units = this.units;
			}, this);
		}, this);
		
		return responses;
	},
	
	getTypeById: function (id) {
		var shapes = _.union(_(ShapeTypes).toArray(), _(FurnitureShapeTypes).toArray());
		
		return _(shapes).detect( function (shapeType) {
			return shapeType.id === id;
		}, this ); 
		
	}
	
});