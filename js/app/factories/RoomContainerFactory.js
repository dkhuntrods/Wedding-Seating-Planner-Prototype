define(["app/models/Plan", "app/models/GridPlan", "app/models/Style", 
		"app/views/room/GridView", "app/views/base/BaseSubCanvasView", "libs/Backbone.Framework"], 

function(Plan, GridPlan, Style, GridView, BaseSubCanvasView) {
    
	function RoomContainerFactory () {};
	RoomContainerFactory.prototype.create = function (model) {	

		var grid = model.grid;
		var room = model.room;
		var units = model.units;

		var gridPlan = new GridPlan({ shape: grid });
		var gridView = new GridView({ model: gridPlan, style: new Style({ lineWidth: 1, strokeStyle:'#e5ebeb'}) });
		var roomPlan = new Plan({ shape: room });
		var roomView = new BaseSubCanvasView({ model: roomPlan, units: units, el: gridView.el, style: new Style({ lineWidth:0, lineStyle:'transparent', fillStyle: 'rgba(205,223,227,0.4)', centred: false, inverted: true}) })
			gridView.addSubView(roomView);

		return gridView;
	};
	
	
	return RoomContainerFactory;
	
});