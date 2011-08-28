Furniture = PhysicalShape.extend({
	
	errorSize: 'A table cannot be less than <%= value %><%= abbr %> in <%= axes %>.',
	errorSlots: 'This table may be too small for <%= num %> seats. Please check with your venue.',
	errorSide: 'The <%= side %> side of this table may be too small for <%= num %> seats. Please check with your venue.',
	
	defaults: {
		x: 0,
		y: 0,
		width:6,
		height:6,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		scaleMode: ScaleMode.NONE,
		type: ShapeTypes.init,
		units: null,
		name: '',
		order: 0,
		buffer: 2.5,
		footprintWidth: 0,
		footprintHeight: 0,
		urlRoot: '/',
		seatSlots : [],
		seatOffset: 0.5,
		elbowRoom : 2
		
	},
	
	initialize: function (attrs) {
		_.bindAll( this, 'handleDimensionsChange', 'resetSlots', 'handleSeatSlotsChange', 'calculatePositions', 'validateSize', 'handleTypeChange');
		console.log('furniture init', this.get('seatSlots'), this.get('type').name);
		
		PhysicalShape.prototype.initialize.call(this, attrs);
		
		this.seats = new SeatList(attrs.seats);
		this.seats.cid = _.uniqueId(this.cid+'_');
		//console.log('setting Furniture ',this.cid, ' seatlist to ', this.seats.cid);
		this.totalSeats = this.seats.length;
		
		this.bind('change:seatSlots', this.handleSeatSlotsChange);
		this.bind('change:type', this.handleTypeChange);
		//this.bind('change', this.callSave);
		
		if ( this.get('seatSlots') === this.defaults.seatSlots ) { console.log('calling resetSlots'); this.resetSlots();}
		this.handleSeatSlotsChange();
	},
	
	callSave: function() {
		console.log('	>> calling save', this.changedAttributes());
		this.save(this.changedAttributes());
	},
	
	resetSlots: function () {
		console.log('[Furniture] resetSlots');	
		this.removeGuests();
		this.set({ 'seatSlots': this.getSlots() });
	},
	
	getSlots: function () {
		console.log('[Furniture] getSlots');	
		
		var slots = [];
		var typeSlots = this.get('type').slots;
		console.log(this.get('type').name, typeSlots);
		
		for (var i = 0; i < typeSlots; i++ ) {
			slots[i] = 0;
		}
		console.log(slots);
		return slots;
	},
	
	handleDimensionsChange: function (attrs) {	
		PhysicalShape.prototype.handleDimensionsChange.call(this, attrs);		
		console.log('[Furniture] handleDimensionsChange', this.cid)
		this.calculatePositions();
	},
	
	handleSeatSlotsChange: function () {
		console.log('[Furniture] handleSeatSlotsChange', this.cid, this.get('seatSlots'));
		this.updateSeatTotal();
		this.calculatePositions();
	},
	
	handleTypeChange: function () {
		//this.resetSlots();
	},
	
	calculatePositions: function (){
		console.log('[Furniture] calculatePositions', this.cid, this.get('seatSlots'));
		
		var seatList = [];
		
			if (this.totalSeats !== 0) { 
		
				var cos = Math.cos,
					sin = Math.sin,
					pi = Math.PI,
					h = 0.5,
			
					seatSlots = this.getSeatsArray( this.get('seatSlots'), this.totalSeats, this.get('type')),
					sides = seatSlots.length,
					tableWidth = this.get('width'),
					tableHeight = this.get('height'),
					buffer = this.get('buffer'),
					rads = 2/sides * pi;
			
				for (var i = 0; i < sides; i++){
			
					var theta,
						distanceX, 
						distanceY,
						fX,
						fY;
					theta = rads * i;
					//theta += (sin(2 * theta) * (tableHeight - tableWidth) * 0.0013); //scale factor to account for ellipse distortion
			
					dX = tableWidth * h * cos(theta - pi * h);
					dY = tableHeight * h * sin(theta - pi * h);
			
					for ( var j = 0; j < seatSlots[i]; j ++ ) {
				
						var cosT = cos(theta),
							sinT = sin(theta),
							n = seatSlots[i],
							w = ( tableWidth * cosT + tableHeight * sinT ),
							t =  w / n,
							sX = (t * j) + (t - (t * h)),
							sY = -buffer * this.get('seatOffset'); // TODO: Fix algorithm so that seats are always added clockwise
				
						fX = dX + cosT * (-w * h + sX) - sinT * sY;
						fY = dY + sinT * (-w * h + sX) + cosT * sY;
						seatList[seatList.length] = { x: fX, y: fY, rotation: theta, table: this, units: this.get('units'), slot: [i,j] };
				
					}
				}
			}
			
			this.seats.updateSeats(seatList);
			//console.log('reset: ', this.seats.cid);
			//this.seats.reset(seatList);
			
	},
	
	getSeatsArray : function(seatSlots, totalSeats, type) {
		
		var tSeats = [];
		
		if (type == FurnitureShapeTypes.top) {
			tSeats = seatSlots;
			
		} else if (seatSlots[0] === totalSeats && seatSlots.length === 1) {
			
			for (var i = 0, j = seatSlots[0]; i < j; i++) {
				tSeats[i] = 1;
			}
			
		} else {
			tSeats = seatSlots;
		}	
			
		//console.log('[Furniture] getSeatsArray', tSeats);
		return tSeats;
	},
	
	updateSeatTotal: function () {
		//console.log('[Furniture] updateSeatTotal');
		this.totalSeats = this.getSeatTotal(this.get('seatSlots'));
	},
	
	getSeatTotal: function (seatSlots) {	
		//console.log('[Furniture] getSeatTotal', this.get('seatSlots'), !_(this.get('seatSlots')).isEmpty() );
		if ( !_(seatSlots).isEmpty() ) {
			totalSeats = _(_(seatSlots).flatten()).reduce( function(memo, num){ return memo + num }); 
		} else {
			totalSeats = 0;
		}
		return totalSeats;
		//console.log('[Furniture] getSeatTotal', totalSeats);
	},
	
	validate: function (attrs) {
		console.log('[Furniture] validate', attrs.width, attrs.height);
		
		if (attrs.width || attrs.height) {
			return this.validateSize(attrs);
		}
		if (attrs.seatSlots) {
			return this.validateSeatSlots(attrs);
		}
	},
	
	validateSize: function (attrs) {
		console.log('validateSize', this.get('units'));
		var errorTemplate = _.template(this.errorSize),
			minVal = 2,
			units = this.get('units'),
			abbr = units.get('abbr'),
			min = Math.formatDecimals(units.checkConversion(minVal, UnitSystems.metric, UnitSystems.metric), 2);
		
		//console.log('min:', min, attrs.width);
		
		if (attrs.width < minVal && attrs.height < minVal) {
			return errorTemplate({ value: min, abbr: abbr, axes: 'width or height' });
		} else if (attrs.width < minVal) {
			return errorTemplate({ value: min, abbr: abbr, axes: 'width' });
		} else if (attrs.height < minVal) {
			return errorTemplate({ value: min, abbr: abbr, axes: 'height' });
		}
	},
	
	validateSeatSlots: function (attrs) {
		console.log('validateSeatSlots');
		var errorTemplate = _.template(this.errorSlots),
			errorRectTemplate = _.template(this.errorSide),
			totalSeats = this.getSeatTotal(attrs.seatSlots),
			//m =console.log(this),
			type = this.get('type'),
			space = this.get('elbowRoom'),
			width = this.get('width'),
			height = this.get('height'),
			floor = Math.floor,
			sqrt = Math.sqrt,
			pow = Math.pow,
			pi = Math.PI,
			slotspaces = [],
			errorMessage = '',
			spacePerGuest;
			
		if (totalSeats > 0) {
			switch (type.sides) {
			case 4: 
				//spacePerGuest = 2 * (floor(width/space) + floor(height/space)) / totalSeats;
				for (var i = 0; i < 4; i++) {
					if (attrs.seatSlots[i] > 0 ) {
						var cd = (i % 2 == 0 ? width : height)
						var sp =  cd / attrs.seatSlots[i];
						if (sp < space * 0.875) {
							slotspaces[i] = { side: this.getSideName(i), num: attrs.seatSlots[i] };
							//attrs.seatSlots[i] = space * cd;
						}					
					}
				}
				_(slotspaces).each( function (slotspace) { errorMessage += errorRectTemplate(slotspace); } ) ;
				//this.set({ seatSlots: attrs.seatSlots });
				break;
			case 1: 
				space *= 0.785;			
				spacePerGuest = (pi * 2 * sqrt((pow((width * 0.5), 2) + pow((height * 0.5), 2)) * 0.5)) / totalSeats;
				if (spacePerGuest < space) {
					errorMessage = errorTemplate({ num: totalSeats });
				}
				break;
			}
		
			console.log('spacePerGuest:', spacePerGuest, space);
			if (errorMessage != '') {
				return errorMessage;
			}
			
		}
	},
	
	getMaxSpace: function (sides){},
	
	getSideName: function (val) {
		switch (val) {
		case 0: return 'top';
		break;
		case 1: return 'right';
		break;
		case 2: return 'bottom';
		break;
		case 3: return 'left';
		break;
		}
	},
	
	checkClosest: function (x, y) {
		var closest,
			distance = 10000000;
		
		this.seats.each( function (seat) {
			var //sX = seat.get('table').get('scaleX'),
				//factor = this.get('units').displayFactor(UnitSystems.imperial) * sX,
				x0 = seat.get('x'), y0 = seat.get('y'),
				d = Math.abs(Math.distance(x, y, x0, y0));
				
			console.log( seat.get('slot'), x, y, x0, y0, d );
			
			if ( d < distance ) {
				closest = seat;
				distance = d;
				console.log( 'closer', seat.cid, distance );
			}
		}, this);
		
		return closest;
	},
	
	getFirstEmptySeat: function (){
		if (!this.seats) return;
		return this.seats.detect( function (seat) {			
			return _(seat.get('guest')).isEmpty();
		});
	},
	
	removeGuests: function (guests) {
		//console.log('[Shape] removeGuests',this.cid, guests);
		if (this.seats.length < 1) return null;
		
		guests = guests || this.getGuests();
	///	console.log(guests);		
		_(this.seats.filter(function (seat) { return !_(seat.get('guest')).isNull() && !_(seat.get('guest')).isUndefined(); })).each( function (seat) { 
			var guest = seat.get('guest');
			if ( _(guests).indexOf(guest) > -1 ) {
				seat.unsetGuest(guest); 
			}
		});
		
	},
	
	
	getGuests: function () {
		//console.log('[Table] getGuests');
		if (this.seats) {
			return this.seats.filter(function (seat) { 
				return !_(seat.get('guest')).isNull() && !_(seat.get('guest')).isUndefined(); 
			}).map( function (seat) { 
				return seat.get('guest') 
			});
		}
		return null;
	}
});