function IETableFactory() { };

IETableFactory.prototype= {
	
	planShapeView: null,
	
	create : function (table) {
		console.log('IETableFactory', table.cid);
		
		var tablePlan = new Plan({ shape:table });
		var style = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#93aebf', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0  });
		var seatStyle = new Style({ fillStyle: '#ebf5f6', strokeStyle: '#b5c9d1', lineWidth: 1, shadowColor : "#ccc", shadowBlur : 3, shadowOffsetX : 0, shadowOffsetY : 0,
		 		iconW:'img/icons/11.png', iconM:'img/icons/12.png', iconw:'img/icons/21.png', iconm:'img/icons/21.png' });
	
		var tableBaseView = new RootShapeView({ className: 'shape shape-edit', model: tablePlan, droppable: true, droppableParams: {accept: 'li.guest', tolerance: 'touch'} });	
	
		var planShapeView = new FurnitureCanvasView({ model: tablePlan, style: style });
	
		$(tableBaseView.el).append( planShapeView.render().el );
		//planShapeView.resetCanvas();	
		
		return tableBaseView;
	},
	
	render: function() {
		trace('render', this.planShapeView);
		this.planShapeView.render();
	}
};
