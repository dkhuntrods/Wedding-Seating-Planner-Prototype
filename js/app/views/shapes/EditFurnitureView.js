define(["./ShapeTypeSelectView", "./FurnitureSeatSlotsView", "libs/Backbone.Framework"], 

function(ShapeTypeSelectView, FurnitureSeatSlotsView) {
    
	var EditFurnitureView = Backbone.View.extend({
		
		className: 'edit-shape',

		initialize: function(attrs) {
			_.bindAll(this, 'render');

			this.factory = attrs.factory;

			this.shapeView = this.factory.create(this.model);
			this.selectView = new ShapeTypeSelectView({ model:this.model });
			this.seatSlotsView = new FurnitureSeatSlotsView({ model:this.model });

			$(this.el).append( this.selectView.el );
			$(this.el).append( this.seatSlotsView.el );
			$(this.el).append( this.shapeView.el );
		},

		render: function() {		
			this.shapeView.render();
			this.selectView.render();
			this.seatSlotsView.render();		

			return this;		
		}
		
	});
	
	return EditFurnitureView;
	
});