define(["app/models/Plan", "app/models/Style", 
		"app/views/shapes/RootShapeView", "app/views/shapes/FurnitureCanvasView", "app/views/shapes/SeatListView", 
		"app/views/shapes/ShapeTitleView", "app/views/shapes/ShapeEditDimensionsView", "app/views/guests/AssignedGuestListView",
		"./GuestWithSeatFactory", 
		"libs/Backbone.Framework"], 

function(Plan, Style, RootShapeView, FurnitureCanvasView, SeatListView, ShapeTitleView, ShapeEditDimensionsView,
	AssignedGuestListView, GuestWithSeatFactory) {
    
	function TableEditComponentsFactory() { };

	TableEditComponentsFactory.prototype= {

		create : function (table) {

			var tablePlan = new Plan({ shape:table });
			var style = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#93aebf', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0  });
			var seatStyle = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#b5c9d1', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0,
			 		iconW:'img/icons/11.png', iconM:'img/icons/12.png', iconw:'img/icons/21.png', iconm:'img/icons/21.png' });

			var tableBaseView = new RootShapeView({ className: 'shape shape-edit', model: tablePlan, droppable: true, droppableParams: {accept: 'li.guest', tolerance: 'touch'} });	

			var planShapeView = new FurnitureCanvasView({ model: tablePlan, style: style });
			var seatsView = new SeatListView({ model: table.seats, el: planShapeView.el, style:seatStyle });
			planShapeView.addSubView(seatsView);

			var titleView = new ShapeTitleView({ model: table });
			var editDimensionsView = new ShapeEditDimensionsView({ model: table });
			var assignedGuestListView = new AssignedGuestListView({ model: table, factory: new GuestWithSeatFactory() });

			$(tableBaseView.el).append( planShapeView.render().el );
			$(tableBaseView.el).append( titleView.render().el );
			$(tableBaseView.el).append( editDimensionsView.render().el );
			$(tableBaseView.el).append( assignedGuestListView.render().el );

			return tableBaseView;
		}
	};
	
	return TableEditComponentsFactory;
	
});