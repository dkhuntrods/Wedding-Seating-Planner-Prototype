define(["libs/Backbone.Framework"], 

function() {
    
	var RootShapeView = Backbone.View.extend({
		
		className: 'shape',
		layerId: '.layer',

		events: {
			'dragstop' : 'handleDragStop'
		},

		handleDragStop: function (event, ui) {

			var shape = this.model.get('shape'),
				units = shape.get('units'),
				factor = units.displayFactor(UnitSystems.imperial),
				x = ui.position.left / factor,
				y = ui.position.top / factor;

			shape.set({ x: x, y: y });
			shape.save();
		},

		initialize: function(attrs) {

			_.bindAll(this, 'render', 'updateFootprint', 'removeViews')

			this.model.bind('change:footprintWidth', this.updateFootprint);
			this.model.bind('change:footprintHeight', this.updateFootprint);
			this.model.bind('remove', this.removeViews );
			this.model.get('shape').bind('remove', this.removeViews);

			this.draggable = attrs.draggable;
			this.draggableParams = attrs.draggableParams;
			this.droppable = attrs.droppable;
			this.droppableParams = attrs.droppableParams;
			this.centred = attrs.centred;
			this.layerId = attrs.layerId || this.layerId;

			this.updateFootprint();

			if (this.draggable) $(this.el).draggable(this.draggableParams);
			if (this.droppable) $(this.el).droppable(this.droppableParams);	

			this.setData();
		},

		render: function() {		
			return this;		
		},

		updateFootprint: function() {			

			$(this.el).css(this.getCSS(this.model));		
		},

		getCSS: function (model) {


			var css = {},
				layer = $('.layer').get(0) || this.IESafeOffsetParent(this.el),
				root = this.IESafeOffsetParent(layer) || this.IESafeOffsetParent(this.el),
				h = model.get('footprintHeight'),
				w = model.get('footprintWidth'),
				oX = model.get('x'),
				oY = model.get('y'),
				lp =  $(layer).position(),
				cw = $(root).innerWidth(),
				ch = $(root).innerHeight(),
				ooX = -lp.left,
				ooY = -lp.top;

			css.width = w;
			css.height = h;

			if (w > h) {
				css.marginTop = css.marginBottom = (w - h) / 2;
				css.marginLeft = css.marginRight = 0;
			} else if (	h > w) {
				css.marginTop = css.marginBottom = 0;
				css.marginLeft = css.marginRight = (h - w) / 2;
			} else {
				css.marginTop = css.marginBottom = 0;
				css.marginLeft = css.marginRight = 0;
			}

			if (oX != 0 || oY != 0) {
				css.position = 'absolute';
				css.left = oX;
				css.top = oY;
			}

			if (this.centred) {
				oX = oX == 0 ? ooX + (cw * 0.5) - (model.get('footprintWidth') * 0.5) : oX;
				oY = oY == 0 ? ooY + (ch * 0.5) - (model.get('footprintHeight') * 0.5) : oY;
				css = _(css).extend({ 'position' : 'absolute', 'left' : oX, 'top' : oY, 'z-index' : model.get('shape').get('order') * 1000 });
			}

			return css;
		},

		IESafeOffsetParent: function (elem)	{
		    try
		    {
		        return elem.offsetParent;
		    }
		    catch(e)
		    {        
		        return document.body;
		    }
		},


		removeViews: function () {		

			this.remove();
			this.model.unbind();
		},	

		setData: function () {

			$(this.el).data('tCid', this.model.cid);
		}
		
	});
	
	return RootShapeView;
	
});