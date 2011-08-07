function TableEditComponentsFactory() { };
TableEditComponentsFactory.prototype.create =  function (table) {
	console.log('TableEditComponentsFactory', table.cid);
	var size = 330;
	
	var tablePlan = new Plan({ shape:table, scaleMode:ScaleMode.FIT, scaleFitSize: size });
	var style = new Style({ fillStyle: '#ddd', strokeStyle: '#eee', lineWidth: 2, shadowColor : "#bcd", shadowBlur : 5, shadowOffsetX : 0, shadowOffsetY : 0 });

	var tableBaseView = new RootShapeView({ className: 'shape shape-edit', model: tablePlan, droppable: true, droppableParams: {accept: 'li.guest', tolerance: 'touch'} });	
	
	var planShapeView = new FurnitureCanvasView({ model: tablePlan, style: style });
	var seatsView = new SeatListView({ model: table.seats, el: planShapeView.el });
	planShapeView.addSubView(seatsView);
	
	var titleView = new ShapeTitleView({ model: table });
	var editDimensionsView = new ShapeEditDimensionsView({ model: table });
	var assignedGuestListView = new AssignedGuestListView({ model: table, factory: new GuestWithSeatFactory() })
	
	$(tableBaseView.el).append( planShapeView.render().el );
	$(tableBaseView.el).append( titleView.render().el );
	$(tableBaseView.el).append( editDimensionsView.render().el );
	$(tableBaseView.el).append( assignedGuestListView.render().el );
	
	return tableBaseView;
};