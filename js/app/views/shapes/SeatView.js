SeatView = BaseSubCanvasView.extend({
		
	initialize: function(){
		
		this.i11 = new Image();
		this.i11.src = FILEPATH + 'img/icons/11.png';
		
		this.i12 = new Image();
		this.i12.src = FILEPATH + 'img/icons/12.png';
		
		this.i21 = new Image();
		this.i21.src = FILEPATH + 'img/icons/21.png';
		
		this.i22 = new Image();
		this.i22.src = FILEPATH + 'img/icons/22.png';
		
		if (this.model) this.setModel(this.model);	
		this.needsRedraw = true;
		//console.log("location: ",  document, document.location, document.location.hostname);
	},	
	
	setModel: function(model) {
		_.bindAll(this, 'removeSeat', 'invalidate', 'getPoint');
		
		this.model = model;
		this.model.bind('remove', this.removeSeat);
		this.model.bind('change', this.invalidate);
		
	},
	
	invalidate: function (){
		console.log('[SeatView] invalidating');
		
		var pcx = this.model.previous('x'),
			pcy = this.model.previous('y'),
			pcw = this.model.previous('width'),
			pch = this.model.previous('height');
		//this.context.clearRect(pcx - pcw * 0.5, pcy - pch * 0.5, pcw, pch);
		if ( this.model.hasChanged('x') || this.model.hasChanged('y') || this.model.hasChanged('width') || this.model.hasChanged('height')) {
			this.needsRedraw = true;
		} 
	},
	
	draw: function (){
		//console.log('[SeatView] draw', this.model.cid, this.model.get('table').cid);
		var seat = this.model,
			round = Math.round,
			//m = console.log(seat.get('table')),
			units = seat.get('table').get('units'),
			ctx = this.getContext(),
			type = parseInt(seat.get('type')),
			//m = console.log( seat.get('x'), seat.get('y') ),
			scaleX = 1/seat.get('table').get('scaleX'),
			scaleY = 1/seat.get('table').get('scaleY'),	
			img,cx,cy,cw,ch, point;
			
		//console.log( scaleX, units );
		
		switch (type) {			
		case SeatTypes.FEMALE_ADULT:
			img = this.i11;	
			break;
		case SeatTypes.FEMALE_CHILD:
			img = this.i12;	
			break;
		case SeatTypes.MALE_ADULT:
			img = this.i21;	
			break;
		case SeatTypes.MALE_CHILD:
			img = this.i22;	
			break;			
		}
		
		if (!_(img).isUndefined()) {
			cw = round(img.width * scaleX);
			ch = round(img.height * scaleY);
			point = this.getPoint(cw, ch);
			cx = point.x; 
			cy = point.y;
			ctx.drawImage(img, cx, cy, cw, ch);
		} else {			
			cw = seat.get('width');
			ch = seat.get('height');
			point = this.getPoint(cw, ch)
			cx = point.x;
			cy = point.y;
			ctx.fillEllipse(cx, cy, cw, ch, 'rgb(225,225,225)');
			//ctx.fillEllipse(cx-1.5, cy-1.5, 3, 3, '#c00');
		}
		
		this.needsRedraw = false;
	},
	
	getPoint: function(cw, ch) {
		var seat = this.model,
			round = Math.round,			
			units = seat.get('table').get('units'),
			cx, cy;
			
		//console.log(seat, units, cw, ch)
		cx = round((seat.get('x') * units.displayFactor(UnitSystems.imperial)) - (cw * 0.5));
		cy = round((seat.get('y') * units.displayFactor(UnitSystems.imperial)) - (ch * 0.5));
		return { x: cx, y: cy }
	},
	
	removeSeat: function (model){
		console.log('[SeatView] removeSeat', this.model.cid, this.model.get('x'), this.model.previous('x') );
		var ctx = this.getContext(),
		cw = model.get('width'),
		ch = model.get('height'),
		point = this.getPoint(cw, ch),
		cx = point.x,
		cy = point.y;
		
		console.log(cx, cy, cw);
		//this.context.clearRect(cx - cw * 0.5, cy - ch * 0.5, cw, ch);
		ctx.strokeRect(cx, cy, cw, ch);
		
		model.unbind();
	}
	
});