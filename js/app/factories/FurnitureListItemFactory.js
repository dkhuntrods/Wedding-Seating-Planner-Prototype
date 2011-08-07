function FurnitureListItemFactory () {};

FurnitureListItemFactory.prototype = {

	create : function (table) {
		
		console.log('[FurnitureListItemFactory] create')
		var tablePlan = new Plan({ shape:table });
		var style = new Style({ fillStyle: '#ddd', strokeStyle: '#eee', lineWidth: 2, shadowColor : "#aaa", shadowBlur : 4, shadowOffsetX : 0, shadowOffsetY : 0 });
	
		var tableBaseView = new RootShapeView({ model: tablePlan, tagName:'li', draggable: true, draggableParams: { cursor: 'move' }, centred: true });
		var planShapeView = new FurnitureCanvasView({ model: tablePlan, style: style });
		var seatsView = new SeatListView({ model: table.seats, el: planShapeView.el });
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
}
