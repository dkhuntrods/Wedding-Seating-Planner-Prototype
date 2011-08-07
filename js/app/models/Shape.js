ScaleMode = {
	NONE: 'none',
	FIT: 'fit',
	FILL: 'fill'
};

SHAPE_INIT_ID = -1;

ShapeTypes = {
	init: {
		id: SHAPE_INIT_ID,
		name:'init',
		sides: -1,
	},
	ellipse: {
		name:'ellipse',
		id: 1,
		sides: 1
	},
	rectangle: {
		name:'rectangle',
		id: 2,
		sides: 4,
	}
};

FurnitureShapeTypes = {
	ellipse: {
		name:'furniture_ellipse',
		id: 3,
		slots: 1,
		sides: 1
	},
	
	rectangle: {
		name:'furniture_rectangle',
		id: 4,
		slots: 4,
		sides: 4
	},
	
	top: {
		name:'top_table',
		id: 5,
		slots: 1,
		sides:4
	},
	
	custom: {
		name:'custom_shape',
		id: 6,
		slots: 0,
		sides: 4
	}
	
};

Shape = Backbone.Model.extend({
	
	defaults: {
		x: 0,
		y: 0,
		width:0,
		height:0,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		scaleMode: ScaleMode.NONE,
		type: null,
		units: null
	},
	
	initialize: function (attrs) {
		console.log('shape init', attrs);
		var type = attrs.type || ShapeTypes.init;
		var units = attrs.units;
		_.bindAll(this, 'getTypeById');
		
		this.set({ type: type });
		this.set({ units: units });
	},
	
	getTypeById: function (id) {
		var shapes = _.union(_(ShapeTypes).toArray(), _(FurnitureShapeTypes).toArray());
		
		return _(shapes).detect( function (shapeType) {
			return shapeType.id === id;
		}, this ); 
		
	}
	
});