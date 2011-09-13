
(function(){
	
	var context2DExtended = {
		
		ellipse : function(x, y, w, h) {
			
			var kappa = .5522848;
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle

			this.moveTo(x, ym);
			this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
			this.closePath();		
			
		},
		
		fillEllipse : function (x, y, w, h, s) {
			
			if (!s) s = { fillStyle: '#eee', lineWidth:1, strokeStyle: '#fff'};
			
			this.fillStyle = s.fillStyle;
			if (s.shadowColor && s.shadowBlur) {				
				this.shadowColor = s.shadowColor;
				this.shadowBlur = s.shadowBlur;
				this.shadowOffsetX = s.shadowOffsetX;
				this.shadowOffsetY = s.shadowOffsetY;
			}			
			this.beginPath();
			this.ellipse(x, y, w, h);
			this.closePath();
			this.fill();
			if (s.shadowColor && s.shadowBlur) {
				this.shadowColor = 'transparent';
				this.shadowBlur = 0;
				this.shadowOffsetX = 0;
				this.shadowOffsetY = 0;
			}
			this.lineWidth = s.lineWidth;
			this.strokeStyle = s.strokeStyle;
			this.stroke();
		},
		
		strokeEllipse : function (x, y, w, h, s) {
			
			if (!s) s = { fillStyle: '#eee', lineWidth:1, strokeStyle: '#fff'};
			
			this.strokeStyle = s.strokeStyle;
			this.lineWidth = s.lineWidth;
			this.beginPath();
			this.ellipse(x, y, w, h);
			this.stroke();
		},
		
		fillRectangle : function(x, y, w, h, s) {
			
			if (!s) s = { fillStyle: '#eee', lineWidth:1, strokeStyle: '#fff'};
			
			this.beginPath();
			this.rect(x -0.5, y -0.5, w, h);
			this.closePath();
			this.fillStyle = s.fillStyle;
			if (s.shadowColor && s.shadowBlur) {				
				this.shadowColor = s.shadowColor;
				this.shadowBlur = s.shadowBlur;
				this.shadowOffsetX = s.shadowOffsetX;
				this.shadowOffsetY = s.shadowOffsetY;
			}
			this.fill();
			if (s.shadowColor && s.shadowBlur) {
				this.shadowColor = 'transparent';
				this.shadowBlur = 0;
				this.shadowOffsetX = 0;
				this.shadowOffsetY = 0;
			}
			
			if (s.lineWidth > 0) {
				this.lineWidth = s.lineWidth;
				this.strokeStyle = s.strokeStyle;
				this.stroke();
			}
		},
		
		dashedLineTo : function (fromX, fromY, toX, toY, pattern) {
		  // Our growth rate for our line can be one of the following:
		  //   (+,+), (+,-), (-,+), (-,-)
		  // Because of this, our algorithm needs to understand if the x-coord and
		  // y-coord should be getting smaller or larger and properly cap the values
		  // based on (x,y).
		  var lt = function (a, b) { return a <= b; };
		  var gt = function (a, b) { return a >= b; };
		  var capmin = function (a, b) { return Math.min(a, b); };
		  var capmax = function (a, b) { return Math.max(a, b); };

		  var checkX = { thereYet: gt, cap: capmin };
		  var checkY = { thereYet: gt, cap: capmin };

		  if (fromY - toY > 0) {
		    checkY.thereYet = lt;
		    checkY.cap = capmax;
		  }
		  if (fromX - toX > 0) {
		    checkX.thereYet = lt;
		    checkX.cap = capmax;
		  }

		  this.moveTo(fromX, fromY);
		  var offsetX = fromX;
		  var offsetY = fromY;
		  var idx = 0, dash = true;
		  while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
		    var ang = Math.atan2(toY - fromY, toX - fromX);
		    var len = pattern[idx];

		    offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
		    offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));

		    if (dash) this.lineTo(offsetX, offsetY);
		    else this.moveTo(offsetX, offsetY);

		    idx = (idx + 1) % pattern.length;
		    dash = !dash;
		  }
		}
		
	};
	
	for ( var key in context2DExtended) {
		CanvasRenderingContext2D.prototype[key] = context2DExtended[key];
	}
	
})();