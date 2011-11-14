define(["app/views/base/BaseCanvasView", "app/models/Style", "libs/Backbone.Framework"], 

function(BaseCanvasView, Style) {
    
	var FurnitureCanvasView = BaseCanvasView.extend({

		initialize: function (attrs) {

			_.bindAll(this, 'render', 'updateDrawMethod', 'draw', 'getContext', 'setShapeHandlers', 'handleSeatSlotsChange', 'handleSeatTypeChange', 'handleGuestChange');

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

			var shape;
			if (shape = model.get('shape')) {		
				shape.bind('change:seatSlots', this.handleSeatSlotsChange);
				shape.bind('change:buffer', this.draw);
				shape.bind('change:rotation', this.draw);
				shape.bind('change:type', this.updateDrawMethod);
				shape.bind('change:seats', this.setSeatHandlers);
				shape.seats.bind('change:type', this.draw);
				shape.seats.bind('change:guest', this.handleGuestChange);
			}
		},

		handleSeatSlotsChange: function() {
			this.draw();
		},

		handleSeatTypeChange: function(){
			this.draw();
		},

		handleGuestChange: function(){
			this.draw();
		},

		render : function () {

			$(this.el).attr({ width: this.model.get('footprintWidth'), height: this.model.get('footprintHeight') });		 
			this.resetCanvas();	

			this.draw();	

			return this;
		},

		resetCanvas: function () {
			var m = this.model.toJSON(),
				ctx = this.getContext();
			
			ctx.setTransform(1,0,0,1,0,0);
			
			if (this.style.get('centred') === true) {
				ctx.translate(m.footprintWidth * 0.5, m.footprintHeight * 0.5);
			}
			ctx.rotate(m.shape.get('rotation'));
		},

		draw : function () {		

			var m = this.model.toJSON(),
				ctx = this.getContext(),
				x, y, w, h;

			if (ctx) {

				ctx.save();

				ctx.clearRect(-m.footprintWidth * 0.5, -m.footprintHeight * 0.5, m.footprintWidth, m.footprintHeight);			

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
	
	return FurnitureCanvasView;
	
});