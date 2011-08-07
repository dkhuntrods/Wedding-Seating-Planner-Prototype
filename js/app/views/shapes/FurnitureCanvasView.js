FurnitureCanvasView = BaseCanvasView.extend({
	
	initialize: function (attrs) {
		console.log('[FurnitureCanvasView]')
		_.bindAll(this, 'render', 'updateDrawMethod', 'draw', 'getContext', 'setShapeHandlers');
		
		this.views = [];
		this.style = attrs.style || new Style();
		
		this.draggable = attrs.draggable;
		this.draggableParams = attrs.draggableParams;
		this.droppable = attrs.droppable;
		this.droppableParams = attrs.droppableParams;
		
		if (this.draggable) $(this.el).draggable(this.draggableParams);
		if (this.droppable) $(this.el).droppable(this.droppableParams);
		
		if (this.model) this.setModel(this.model);		
	},
	
	setModel: function (model) {
		var model = this.model = model;			
		
		model.bind('change:shape', this.setShapeHandlers);
		model.bind('change:width', this.draw);
		model.bind('change:height', this.draw);
		model.bind('change:scaleX', this.draw);
		model.bind('change:scaleY', this.draw);		
		model.bind('change:footprintWidth', this.render);
		model.bind('change:footprintHeight', this.render);
		
		this.setShapeHandlers(model);		
		this.updateDrawMethod({ silent : true });
		
	},
	
	setShapeHandlers: function (model) {
		console.log('setShapeHandlers', model);
		var shape;
		if (shape = model.get('shape')) {		
			shape.bind('change:seatSlots', this.draw);
			shape.bind('change:buffer', this.draw);
			shape.bind('change:rotation', this.draw);
			shape.bind('change:type', this.updateDrawMethod);
			shape.bind('change:seats', this.setSeatHandlers);
			shape.seats.bind('change:type', this.draw);
			shape.seats.bind('change:guest', this.draw);
		}
	},
	
	render : function () {
		console.log("[FurnitureCanvasView] render", this.model.cid, this.model.get('shape').cid, this.model.get('footprintWidth'), this.model.get('footprintHeight'));
		
		$(this.el).attr({ width: this.model.get('footprintWidth'), height: this.model.get('footprintHeight') });		
		this.resetCanvas();	
			
		this.draw();	
		
		return this;
	},
	
	resetCanvas: function () {
		var m = this.model.toJSON(),
			ctx = this.getContext();
		
		ctx.scale(1, 1);
		if (this.style.get('centred') === true) {
			ctx.translate(m.footprintWidth * 0.5, m.footprintHeight * 0.5);
		}
		ctx.rotate(m.shape.get('rotation'));
	},
	
	draw : function () {		
		console.log( '[FurnitureCanvasView] draw', this.model.cid, this.model.get('shape').cid, _.isFunction(this.drawShape), this.model.get('width'), this.model.get('height'));
	
		var m = this.model.toJSON(),
			ctx = this.getContext(),
			x, y, w, h;
			
		if (ctx) {
			
			ctx.save();
			
			ctx.clearRect(-m.footprintWidth * 0.5, -m.footprintHeight * 0.5, m.footprintWidth, m.footprintHeight);			
			//console.log('width', m.footprintWidth)
			ctx.scale(m.scaleX, m.scaleY);
			
			if ( _.isFunction(this.drawShape) ) {		
				if (this.style.get('centred') === true) {
					x = (- m.width * 0.5) + 0.5;
					y = (- m.height * 0.5) + 0.5;
				} else {
					x = 0.5;
					y = 0.5;
				}
				this.drawShape( ctx, x, y, m.width, m.height, this.style.toJSON() );				
			}
			
			this.drawSubViews();
			
			ctx.restore();
		}
		
	},
	
	updateDrawMethod : function( params ) {
		console.log('[FurnitureCanvasView] updateDrawMethod', this.model.get('shape').get('type'));
		
		switch ( this.model.get('shape').get('type').sides ) {
		case 4 :  
			this.drawShape = this.drawRectangularShape;
			break;
		case 1 :  
			this.drawShape = this.drawEllipticalShape;
			break;
		case -1 : 
			this.drawShape = null;
			break;
		default : 
			this.drawShape = null;
		}
		
		this.draw();
	}
});