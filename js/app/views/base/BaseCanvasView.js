BaseCanvasView = Backbone.View.extend({
	
	tagName: 'canvas',
	
	drawRectangularShape : function(ctx, x, y, w, h, s) {
		//console.log('[BaseCanvasView] try drawRectangularShape', s);
		
		if(ctx) {			
			ctx.fillRectangle(x, y, w, h, s);
			//ctx.fillEllipse(0,0,3,3, '#f00');			
		}
	},
	
	drawEllipticalShape : function(ctx, x, y, w, h, s) {
		//console.log('[BaseCanvasView] try drawEllipticalShape', s);	
	
		if(ctx) { 		
			//console.log('	[BaseCanvasView] drawEllipticalShape');	
			ctx.fillEllipse(x, y, w, h, s);
			//ctx.fillEllipse(0,0,3,3, '#f00');
		}
	},
	
	drawSubViews: function () {
		_(this.views).each( function (view) {
			//console.log('[BaseCanvasView] drawing sub view')
			view.draw();
		});
	},
	
	addSubView: function (view) {
		this.views[this.views.length] = view;
	},
	
	getContext: function() {
		//console.log("[BaseCanvasView] getContext");	
		var ctx;
		
		if( $(this.el) && $(this.el).get(0) )	{
			var canvas = $(this.el).get(0);
			//canvas.onselectstart = function () { return false; }
			ctx = $(this.el).get(0).getContext("2d");
		}		
		return ctx;	
	}
	
});