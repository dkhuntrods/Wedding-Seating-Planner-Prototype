RootRoomView = Backbone.View.extend({
	
	className: 'canvasContainer',
	templateId: 'app-frame-template',
	containerId: '.canvasContainer',
	
	events: {		
		'dragstop' : 'handleResize'
		//'click'
	},
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'handleResize');
		console.log('[RootRoomView] initialize');
		this.templateId = attrs.templateId || this.templateId;
		this.layerId = attrs.layerId || this.layerId;
		this.factory = attrs.factory;
		
		this.handleResize({ target: $(this.el).get(0) });
		
		this.views = attrs.factory.create(this.model);
		
		this.model.room.bind('change:width', this.views.draw);
		this.model.room.bind('change:height', this.views.draw);
		this.model.units.bind('change:system', this.views.draw);
	},
	
	render: function () {
		console.log('[RootRoomView] render')		
		this.$(this.containerId).html( this.views.render().el );			
		return this;
	},
	
	handleResize: function (event) {
		console.log('handleResize', event);
		
		var factor = this.model.units.displayFactor(UnitSystems.imperial), 
			layer = $(this.el).get(0),
			root = $(layer).offsetParent().get(0),
			layerWidth = $(layer).innerWidth(),
			layerHeight = $(layer).innerHeight(),
			list = $(layer).find('.shape-list').get(0),
			
			listWidth = list ? list.scrollWidth : 0;
			listHeight = list ? list.scrollHeight : 0;
			//sfd = console.log(listWidth, listHeight, $(layer).innerWidth(), $(layer).innerHeight());
			width = Math.max(layerWidth, listWidth) / factor,
			height = Math.max(layerHeight, listHeight) / factor,
			el = $(this.el),
			ev = $(event.target);
		
		if ($(event.target).hasClass('layer')) {
			var t = $(event.target).position(),
				dSX = t.left,// > 0 ? t.offsetLeft : 0,
				dSY = t.top,// > 0 ? t.offsetTop : 0;
				sX = dSX/factor,
				sY = dSY/factor;
				
				width += Math.abs(sX);
				height += Math.abs(sY);
			
			this.model.grid.set({ x: sX, y: sY });
			this.model.room.set({ x: sX + 1, y: sY + 1 });
			this.$(this.containerId).css({ position: 'absolute', left: -dSX, top: -dSY });
		}
		
		
		this.model.grid.set({ width: width, height: height });

	}
	
})