EditShapeWithGuests = Backbone.Model.extend({
	
	defaults: {
		eid: ''
	},
	
	initialize : function(attrs) {
		console.log('[EditShapeWithGuests] initialize');	
		_.bindAll( this, 'setShape', 'getShape', 'saveShape','createShapePreview', 'createSeatsPreview', 'moveGuestToSeat', 'exitShape', 'removeGuestFromSeat', 'removeGuestsFromShape', 'transferGuestBetweenSeats', 'moveGuestFromShapeByCid')

		this.initGuests = null;
		this.subjectShape = null;
		
		this.editShape = attrs.editShape;
		this.interimShape = null;
		this.shapes = attrs.shapes;		
		this.guests = attrs.guests;
		this.units = attrs.units;
		
		this.moveGuest = new MoveGuest({ shapes: this.shapes });
		
		this.set({ eid: 'new', state:'inactive' });
		//this.editShape.seats.bind('remove', this.removeGuestFromSeat);
		console.log('	',this.editShape.cid);
		
	},
	
	
	getShape: function (cid, initOb) {
		if ( cid && this.shapes.getByCid(cid) ) {
			return this.shapes.getByCid(cid);
		} else {
			var table = new Furniture({ units: this.units }),
			order = this.shapes.nextOrder(),
			name = 'Table '+order;
			table.set({ order: order, name: name });
			return table;
		}
	},
	

	setShape: function () {
		//console.log(this.get('eid'));
		
		var st = this.subjectShape = this.interimShape = this.getShape(this.get('eid')),
			et = this.editShape,
			stJSON = st.toJSON(),		
			scale = this.getNewScale(st);
		
		//this.editShape.resetSlots();
		//this.editShape.set({ type: ShapeTypes.init }, {silent:true});
		//this.editShape.removeGuests();
		
		delete stJSON.id;
		delete stJSON.seatOffset;
		delete stJSON.buffer;
		
		console.log('json before:', stJSON.seatSlots[0], et.toJSON().seatSlots[0] );
		et.set(stJSON, {silent:true});
		
		
		
		if (et.hasChanged('type')) et.trigger('change:type');
		if (et.hasChanged('width')) et.trigger('change:width');	
		if (et.hasChanged('height')) et.trigger('change:height');
		et.trigger('change:seatSlots');	
		
		et.set({ scaleX: scale, scaleY: scale });
		
		console.log('json after:', stJSON.seatSlots, et.toJSON().seatSlots);
		this.transferGuests(st, et, true);
	},
	
	
	saveShape: function (cid) {
		console.log('[EditShapeWithGuests] saveShape')
		var st = this.subjectShape,
			et = this.editShape,
			etJSON, seats;
		
		et.set({ 'scaleX':1, 'scaleY': 1 });
		etJSON = et.toJSON();
		
		delete etJSON.id;
		delete etJSON.seatOffset;
		delete etJSON.buffer;
		
		console.log('save:', st.cid);	
		console.log(st.set(etJSON, {silent:true}));
			
		console.log('save:', st.cid, st.toJSON(), etJSON);
		
		//console.log(st.seats.cid);
		
		if (this.shapes.indexOf(st) < 0) {
			console.log('table'+st.get('order'), 'table'+et.get('order'));
			st.set({ id: 'table'+st.get('order')});
			this.shapes.add(st);
		}
		//st.set({ type: etJSON.type });
		//st.set({ width: etJSON.width, height: etJSON.height });
		//st.set({ seatSlots: etJSON.seatSlots });
		
		if (st.hasChanged('type')) st.trigger('change:type');
		if (st.hasChanged('width')) st.trigger('change:width');	
		if (st.hasChanged('height')) st.trigger('change:height');
		st.trigger('change:seatSlots');	
		
		this.transferGuests(et, st);
		
	},
	
	exitShape: function () {
	
		var st = this.subjectShape,
			it = this.interimShape,
			et = this.editShape,
			stJSON = st.toJSON();
		
		this.transferGuests(it, st, true);
		//this.editShape.resetSlots();
		this.editShape.set({ type: ShapeTypes.init });
		this.editShape.removeGuests();
		//this.editShape.reset();
	},
	
	createShapePreview : function (input) {
		console.log('[EditShapeWithGuests] createShapePreview', input.selected() );
		
		var scale,
			selectedId = parseInt( input.selected() )
			type = _(Shapes).detect( function(shape) { return selectedId === shape.id }, this );
		
		this.removeGuestsFromShape(this.editShape);
		
		this.editShape.set({ 'type' : type });		
		this.editShape.set({ 'seatSlots' : [] });	// TODO: Allow type selection to change and re-flow seats, rather that just resetting	
		
		scale = this.getNewScale(this.editShape);
		console.log(scale);
		if (scale !== 1) this.editShape.set({ scaleX: scale, scaleY: scale });		
		this.inputs.reset( InitData.getSeatInputParams(selectedId) );
	},
	
	createSeatsPreview : function(seatInput) {
		console.log('[EditShapeWithGuests] createSeatsPreview');		
		this.editShape.set({ 'seatSlots' : this.inputs.toJSON().map( function(item){ return item.value || 0 } ) });
	},	
	
	removeGuestsFromShape: function(table) {
		console.log('[EditShapeWithGuests] removeGuestsFromShape');
		
		var table = table || this.editShape;			
		table.seats.each(this.removeGuestFromSeat);
	},
		
	getNewScale: function (table) {
		var editDim = 380/25,
			tableWidth = table.get('footprintWidth'),
			tableHeight = table.get('footprintHeight'),
			//x = console.log(tableWidth, tableHeight),
			maxDim = tableWidth > tableHeight ? tableWidth : tableHeight;
		 
		return editDim / parseInt(maxDim);
	},
	
	transferGuests: function (fromShape, toShape, copy) {
		console.log('[EditShapeWithGuests] transferGuests', fromShape.seats.length, toShape.seats.length, !copy);	
		
		var l = Math.max(toShape.seats.length, fromShape.seats.length)
		
		for ( var i = 0; i < l; i++) {
			console.log('>><<',i,'>><<', fromShape.seats, toShape.seats)
			var fromSeat = fromShape.seats.at(i),
				toSeat = toShape.seats.at(i);
			
			this.transferGuestBetweenSeats(fromSeat, toSeat, copy);
		}
	},
	
	transferGuestBetweenSeats: function (fromSeat, toSeat, copy) {
		console.log('[EditShapeWithGuests] transferGuestBetweenSeats', fromSeat, toSeat);
		var fromGuest, toGuest;
		
		if ( toSeat ) {
			console.log('toSeat', toSeat.get('guest'));
			
			if (toGuest = toSeat.get('guest')) {				
				console.log('toGuest')
				if (!fromSeat || !(fromGuest = fromSeat.get('guest'))) {						
					console.log('removing',toGuest.get('label'),'from toShape');					
					this.removeGuestFromSeat(toSeat);
				
				} else if (fromGuest && toGuest) {	
					console.log('fromGuest && toGuest')
					if (toGuest != fromGuest && (this.editShape.cid === fromSeat.get('table').cid || fromSeat.get('table').cid === toSeat.get('table').cid)) {
						if (fromGuest.get('seat')) {
							console.log('swapping',toGuest.get('label'),'on seat',toSeat.cid,'with', fromGuest.get('label'));
							this.swapGuests(fromSeat, toSeat);
						} else {
							console.log('moving',fromGuest.get('label'),'to seat',toSeat.cid);
							this.moveGuestToSeat(fromGuest, toSeat);
						} 
					} else {
						console.log('no action')
						
						if (!copy) {
							this.moveGuestToSeat(fromGuest, toSeat, fromSeat);
						} else {
							this.moveGuestToSeat(fromGuest, toSeat);
						}
						
					}					
					return;				
				}
			}
			
			if (fromSeat && (fromGuest = fromSeat.get('guest'))) {
				console.log('fromSeat && fromGuest')
				if (!copy) {
					this.moveGuestToSeat(fromGuest, toSeat, fromSeat);
				} else {
					this.moveGuestToSeat(fromGuest, toSeat);
				}				
			}
			
		} else {
			console.log('!toSeat')
			if (fromSeat && (fromGuest = fromSeat.get('guest'))) {
				this.removeGuestFromSeat(fromSeat, fromGuest); // If edit new exits sans save 				
			}
		}
		
	},
	
	
	swapGuests: function (fromSeat, toSeat) {
		console.log('[EditShapeWithGuests] swapGuests', fromSeat, toSeat);
		var fromGuest = fromSeat.get('guest'),
			toGuest = toSeat.get('guest');
			
		if ((fromGuest = fromSeat.get('guest')) && (toGuest = toSeat.get('guest'))) {	
			toSeat.unsetGuest(toGuest);
			fromSeat.unsetGuest(fromGuest);
			toSeat.setGuest(fromGuest);
			fromSeat.setGuest(toGuest);	
		}
	},
	
	
	moveGuestToSeat: function (guest, toSeat, fromSeat) {
		console.log('[EditShapeWithGuests] moveGuestToSeat', guest);
		/*
		if (this.guests.indexOf(guest) > -1) {
			this.guests.remove(guest);		
		}
		*/
		if (toGuest = toSeat.get('guest')) {
			this.removeGuestFromSeat(toSeat);
		}
		
		if (fromSeat) {
			fromSeat.unsetGuest(guest);
		}
		
		toSeat.setGuest(guest);
		//this.guests.trigger('remove', guest);		
	},
	
	
	removeGuestFromSeat: function (seat) {
		console.log('[EditShapeWithGuests] removeGuestFromSeat', seat.cid, (seat.get('guest') && seat.get('guest').get('label')));		
		
		var guest;
		
		if (guest = seat.get('guest')) { 
			console.log('	[EditShapeWithGuests] removeGuestFromSeat', guest.get('label'));			
			seat.unsetGuest(guest);
			/*
			if (this.guests.indexOf(guest) === -1) {
				console.log('adding',guest.get('label'),'to Guestlist');
				this.guests.add(guest);						
			}
			*/
		}		
	},
	
	moveGuestToShapeByCid: function (gCid, tCid, sCid) {
		console.log('[EditShapeWithGuests] moveGuestToShapeByCid');
		var guest = this.guests.getByCid(gCid),
			seat = this.editShape.seats.getByCid(sCid);
	
		this.moveGuestToSeat(guest, seat);
	},
		
	removeGuestFromShapeByCid: function (tCid, sCid) {
		console.log('[EditShapeWithGuests] removeGuestFromShapeByCid');
		
		var table = (tCid == this.editShape.cid) ? this.editShape : this.shapes.getByCid(tCid),		
		 	seat = table.seats.getByCid(sCid);		
		this.removeGuestFromSeat(seat);
	},
	
	moveGuestFromShapeByCid: function (tCid, sCid) {
		console.log('[EditShapeWithGuests] moveGuestFromShapeByCid', tCid, sCid);
		console.log(this.subjectShape.cid);
		var fromShape = this.shapes.getByCid(tCid) || this.editShape,
		fromSeat = fromShape.seats.getByCid(sCid),
		fromGuest = fromSeat.get('guest');
		
		this.set({ state: 'active move-guest'});
		console.log('g',this.moveGuest);
		this.moveGuest.set({ otCid: this.subjectShape.cid });
		this.moveGuest.set({ guest: fromGuest  });
		//this.moveGuest.trigger('change:guest');
	},
	
	transferGuestBetweenSeatsByCid: function (ptCid, psCid, tCid, sCid) {
		console.log('[EditShapeWithGuests] transferGuestBetweenSeatsByCid', ptCid, psCid, tCid, sCid);
		
		var fromShape = this.shapes.getByCid(ptCid) || this.editShape,
			toShape = this.shapes.getByCid(tCid) || this.editShape,
			fromSeat = fromShape.seats.getByCid(psCid),
			toSeat = toShape.seats.getByCid(sCid);
			
		//console.log(fromSeat.cid, toSeat.cid, fromShape.getGuests()[0].seat.cid);
		if (fromSeat !== toSeat) {
			this.transferGuestBetweenSeats(fromSeat, toSeat);
		}	
	},
	
	transferGuestToShape: function(ptCid, psCid, tCid) {
		var fromShape = this.shapes.getByCid(ptCid) || this.editShape,
			toShape = this.shapes.getByCid(tCid) || this.editShape,
			fromSeat = fromShape.seats.getByCid(psCid),
			toSeat = toShape.getFirstEmptySeat();
		
		if (fromSeat !== toSeat) {
			this.transferGuestBetweenSeats(fromSeat, toSeat);
		}
		
		this.set({ state: 'active' });
	}
	
	
});