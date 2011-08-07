SHAPE_INIT_ID :-1;

Sides : {	
	RECTANGLE_SIDES = 4;
	ELLIPSE_SIDES = 1;
}

ShapeType = Backbone.Model.extend({
	 
	defaults: {
		id: SHAPE_INIT_ID,
		sides: -1,
		slots: 0
	}
	
	initialize: function () {
		
	}
	
});