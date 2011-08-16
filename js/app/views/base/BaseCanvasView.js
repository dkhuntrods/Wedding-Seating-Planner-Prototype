BaseCanvasView = Backbone.View.extend({
	
	tagName: 'canvas',
	
	drawRectangularShape : function(ctx, x, y, w, h, s) {
		//console.log('[BaseCanvasView] try drawRectangularShape', s);
		
		if(ctx) {			
			ctx.fillRectangle(x, y, w, h, s);
			//ctx.fillEllipse(0,0,3,3, '#f00');			
		}
	},
	
	drawRectangularShapeInverted : function(ctx, x, y, w, h, s) {
		console.log('[BaseCanvasView] try drawRectangularShapeInverted', this.canvas, this.canvas.width);
		
		if (this.canvas && ctx) {
			cvs = this.canvas;
			
			ctx.fillStyle = s.fillStyle;
			ctx.beginPath();
			
			ctx.moveTo(0, 0);
			ctx.lineTo(cvs.width, 0);
			ctx.lineTo(cvs.width, cvs.height);
			ctx.lineTo(0, cvs.height);
			ctx.lineTo(0, 0);
			
			ctx.moveTo(x, y);
			ctx.lineTo(x, h + y);
			ctx.lineTo(w + x, h + y);
			ctx.lineTo(w + x, y);
			ctx.lineTo(x, y);
		
			ctx.closePath();
			ctx.fill();
			
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
			this.canvas = $(this.el).get(0);
			if($.browser.msie) G_vmlCanvasManager.initElement(this.canvas); 
			//canvas.onselectstart = function () { return false; }
			ctx = this.canvas.getContext("2d");
		}		
		return ctx;	
	}
	
});