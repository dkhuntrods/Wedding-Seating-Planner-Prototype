define(["libs/Backbone.Framework"],  

function() {
    
	var BaseCanvasView = Backbone.View.extend({
		
		tagName: 'canvas',
		ieFixDiv: null,
		isSub:false,

		drawRectangularShape : function(ctx, x, y, w, h, s) {

			if(ctx) {			
				ctx.fillRectangle(x, y, w, h, s);		
			}
		},

		drawRectangularShapeInverted : function(ctx, x, y, w, h, s) {

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

			if(ctx) { 		

				ctx.fillEllipse(x, y, w, h, s);
			}
		},

		drawSubViews: function () {
			_(this.views).each( function (view) {

				view.draw();
			});
		},

		addSubView: function (view) {
			this.views[this.views.length] = view;
		},

		getContext: function() {
			
			var ctx;

			if( $(this.el) && $(this.el).get(0) )	{

				this.canvas = this.ieFix( $(this.el).get(0) );			
				ctx = this.canvas.getContext("2d");			
			}		
			return ctx;	
		},

		ieFix: function (elem) {		

			if ( typeof(G_vmlCanvasManager) != 'undefined') {
				var div = $('#ieFixDiv'),
					width = this.model.get('footprintWidth'), 
					height = this.model.get('footprintHeight'),
					parent;

				if (div.length == 0) {
					this.ieFixDiv = $('<div id="ieFixDiv"></div>');
					$('body').append(this.ieFixDiv);
				} else {
					this.ieFixDiv = div;
				}

				parent = $(this.el).parent().get(0);

				if (!parent) {

					this.ieFixDiv.append(elem);
				}

				if ( !(this.isSub) ) $(elem).attr({ width: width, height: height });

				elem = G_vmlCanvasManager.initElement(elem);
			}

			return elem;
		}
		
	});
	
	return BaseCanvasView;
	
});