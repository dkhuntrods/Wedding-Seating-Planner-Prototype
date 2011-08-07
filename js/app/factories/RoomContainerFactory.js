function RoomContainerFactory () {};
RoomContainerFactory.prototype.create = function (model) {	
	
	
	var grid = model.grid;
	var room = model.room;
	var units = model.units;
		
	var gridPlan = new GridPlan({ shape: grid });
	var gridView = new GridView({ model: gridPlan, style: new Style({ lineWidth: 1, strokeStyle:'#eee'}) });
	var roomPlan = new Plan({ shape: room });
	var roomView = new BaseSubCanvasView({ model: roomPlan, units: units, el: gridView.el, style: new Style({ lineWidth:4, strokeStyle:'#ddd', fillStyle: 'transparent', centred: false}) })
		gridView.addSubView(roomView);
	
	return gridView;
};
