function ShapeOptionFactory() {};

ShapeOptionFactory.prototype = {

	create : function (model) {
		
		var view = new ShapeMoveGuestView({ model: model});
		return view;
	}
	
};