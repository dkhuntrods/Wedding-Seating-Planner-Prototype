define(["app/models/Plan", "app/models/Style", 
		"app/views/shapes/RootShapeView", "app/views/shapes/FurnitureCanvasView", "app/views/shapes/SeatListView", 
		"app/views/shapes/ShapeTitleView", "app/views/shapes/ShapeMenuView", "app/views/guests/AssignedGuestListView",
		"./GuestWithTableFactory", 
		"libs/Backbone.Framework"], 

function(Plan, Style, RootShapeView, FurnitureCanvasView, SeatListView, ShapeTitleView, ShapeMenuView,
	AssignedGuestListView, GuestWithTableFactory) {
    
	function FurnitureListItemFactory () {};

	FurnitureListItemFactory.prototype = {

		create : function (table) {
			
			var tablePlan = new Plan({ shape:table });
			var style = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#93aebf', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0  });
			var seatStyle = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#b5c9d1', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0,
			 	iconW:'img/icons/11s.png', iconM:'img/icons/12s.png', iconw:'img/icons/21s.png', iconm:'img/icons/21s.png' });

			var tableBaseView = new RootShapeView({ model: tablePlan, tagName:'li', draggable: true, draggableParams: { cursor: 'move' }, centred: true });
			var planShapeView = new FurnitureCanvasView({ model: tablePlan, style: style });
			var seatsView = new SeatListView({ model: table.seats, el: planShapeView.el, style:seatStyle });
			planShapeView.addSubView(seatsView);

			var titleView = new ShapeTitleView({ model: table });
			var menuView = new ShapeMenuView({ model: table, className:'menu table-menu'});
			var assignedGuestListView = new AssignedGuestListView({ model: table, factory: new GuestWithTableFactory(), className:'guest-list guest-list-assigned-table' })

			$(tableBaseView.el).append( planShapeView.render().el );
			$(tableBaseView.el).append( titleView.render().el );
			$(tableBaseView.el).append( menuView.render().el );
			$(tableBaseView.el).append( assignedGuestListView.render().el );

			return tableBaseView;
			
		}
	};
	
	return FurnitureListItemFactory;
	
});