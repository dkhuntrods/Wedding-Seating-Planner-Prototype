RoomContainer = Backbone.Model.extend({
	
	initialize: function(attrs, options) {
		
		this.units = attrs.units;
		this.grid = new Grid({ colWidth: 1, rowHeight:1, width:38, height:20, units: attrs.units, type: ShapeTypes.rectangle});
		this.room = new PhysicalShape({ x: 1, y: 1, width: 36, height: 20, units: attrs.units, type: ShapeTypes.rectangle });
	
	}
	
});