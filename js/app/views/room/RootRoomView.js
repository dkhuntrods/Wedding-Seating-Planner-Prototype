define(["libs/Backbone.Framework"], 

function() {
    
	var RootRoomView = Backbone.View.extend({
		
		className: 'canvasContainer',
		templateId: 'app-frame-template',
		containerId: '.canvasContainer',

		initialize: function (attrs) {
			_.bindAll(this, 'render', 'setRootSize', 'handleDraw');

			this.templateId = attrs.templateId || this.templateId;
			this.layerId = attrs.layerId || this.layerId;
			this.factory = attrs.factory;

			this.setRootSize({ target: $(this.el).get(0) });

			this.views = attrs.factory.create(this.model);
			
			this.model.room.bind('change:width', this.setRootSize);
			this.model.room.bind('change:height', this.setRootSize);
			this.model.room.bind('change:width', this.handleDraw);
			this.model.room.bind('change:height', this.handleDraw);
			this.model.units.bind('change:system', this.setRootSize);
			this.model.units.bind('change:system', this.handleDraw);
			
		},
		
		handleDraw: function() {
			this.views.draw();
		},
		
		render: function () {

			this.views.render();		
			this.$(this.containerId).html( this.views.el );			
			return this;
		},

		setRootSize: function(event) {

			var units = this.model.units,
				factor = units.displayFactor(UnitSystems.imperial), 
				layer = $(this.el).get(0),
				root = this.IESafeOffsetParent(layer),
				w1 = $(root).innerWidth(), h1 = $(root).innerHeight(),
				w2 = w1 / factor, h2 = h1 / factor,
				w3 = this.model.room.get('width'), h3 = this.model.room.get('height'),
				offset = units.checkConversion(1, UnitSystems.metric, UnitSystems.imperial);

			this.model.grid.set({ x: (1.5 * w2) + 1, y: (1.5 * h2) + 1, width: w3 + 3 * w2, height: h3 + 3 * h2 });
			this.model.room.save({ x: (1.5 * w2) + 1, y: (1.5 * h2) + 1 });

			this.$(this.containerId).css({ position: 'absolute', left: -1.5 * w1 , top: -1.5 * h1 });
			
			//this.model.room.save();
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
		}
		
	});
	
	return RootRoomView;
	
});