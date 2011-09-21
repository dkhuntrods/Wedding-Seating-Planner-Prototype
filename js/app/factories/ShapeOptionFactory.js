define(["app/views/shapes/ShapeMoveGuestView", "libs/Backbone.Framework"], 

function(ShapeMoveGuestView) {
    
	function ShapeOptionFactory() {};

	ShapeOptionFactory.prototype = {

		create : function (model) {

			var view = new ShapeMoveGuestView({ model: model});
			return view;
		}

	};
	
});