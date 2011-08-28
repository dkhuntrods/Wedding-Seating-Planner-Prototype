$(function(){

RootShapeView = Backbone.View.extend({
	
	className: 'shape',
	layerId: '.layer',
	
	events: {
		'dragstop' : 'handleDragStop'
	},
	
	handleDragStop: function (event, ui) {
		//console.log(event, ui, ui.position.left, ui.position.top);
		var shape = this.model.get('shape'),
			units = shape.get('units'),
			factor = units.displayFactor(UnitSystems.imperial),
			x = ui.position.left / factor,
			y = ui.position.top / factor;
			
		shape.set({ x: x, y: y });
		shape.save(null, true);
	},
	
	initialize: function(attrs) {
		console.log('[RootShapeView] initialize')
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
		console.log('updateFootprint');		
		$(this.el).css(this.getCSS(this.model));		
	},

	getCSS: function (model) {
		//console.log('getCSS', this.$('.table') );
		var css = {},
			layer = $('.layer').get(0) || $(this.el).offsetParent().get(0),
			root = $(layer).offsetParent().get(0) || $(this.el).offsetParent().get(0),
			h = model.get('footprintHeight'),
			w = model.get('footprintWidth'),
			//factor = units.displayFactor(UnitSystems.imperial),
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
	
	
	
	removeViews: function () {		
		console.log('removeViews', this.model, this.cid)
		this.remove();
		this.model.unbind();
	},	
	
	setData: function () {
		//console.log('setData cid', this.model.cid)
		$(this.el).data('tCid', this.model.cid);
	}
	
});

});