define(["./Furniture", "./MoveGuest", "libs/Backbone.Framework"], 

function(Furniture, MoveGuest) {
    
	var EditShapeWithGuests = Backbone.Model.extend({
		
		defaults: {
			eid: ''
		},

		initialize : function(attrs) {
			_.bindAll( this, 'setShape', 'getShape', 'saveShape', 'moveGuestToSeat', 'exitShape', 'removeGuestFromSeat', 'removeGuestsFromShape', 'transferGuestBetweenSeats', 'moveGuestFromShapeByCid')

			this.initGuests = null;
			this.subjectShape = null;

			this.editShape = attrs.editShape;
			this.interimShape = null;
			this.shapes = attrs.shapes;		
			this.guests = attrs.guests;
			this.units = attrs.units;

			this.moveGuest = new MoveGuest({ shapes: this.shapes });

			this.set({ eid: 'new', state:'inactive' });

		},


		getShape: function (cid, initOb) {
			if (!this.shapes) return;

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
			if (!this.shapes || !this.editShape) return;

			var st = this.subjectShape = this.interimShape = this.getShape(this.get('eid')),
				et = this.editShape,
				stJSON = st.toJSON(),		
				scale = this.getNewScale(st);

			et.set({
				name: stJSON.name,
				type: stJSON.type,
				width: stJSON.width,
				height: stJSON.height,
				seatSlots: stJSON.seatSlots,
				scaleX: scale, 
				scaleY: scale
			});

			this.transferGuests(st, et, true);

		},


		saveShape: function (cid) {

			if (!this.shapes || !this.editShape || !this.subjectShape || !this.interimShape || this.editShape.get('type').id == -1) return;

			var st = this.subjectShape,
				it = this.interimShape,
				et = this.editShape,
				etJSON, seats;

			et.set({ scaleX: 1, scaleY: 1 });
			etJSON = et.toJSON();

			st.set({
				name: etJSON.name,
				type: etJSON.type,
				width: etJSON.width,
				height: etJSON.height,
				seatSlots: etJSON.seatSlots.concat()
			});
			
			this.transferGuests(et, st);

			if (this.shapes.indexOf(st) < 0) {
				this.shapes.add(st);
				st.save();
				//st.set({ id: 'table'+st.get('order')});
			} else {
				st.save();
			}

			this.guests.saveCollectionAtTable(st.id);

		},

		exitShape: function () {
			if (!this.shapes || !this.editShape || !this.subjectShape || !this.interimShape ) return;

			var st = this.subjectShape,
				it = this.interimShape;

			this.transferGuests(it, st, true);
			this.editShape.set({ type: ShapeTypes.init });
			this.editShape.removeGuests();
		},

		removeGuestsFromShape: function(table) {

			if ( !this.editShape || !table ) return;

			var table = table || this.editShape;			
			table.seats.each(this.removeGuestFromSeat);
		},

		getNewScale: function (table) {

			if ( !table || !this.units ) return 1;
			
			var editDim = 456,					
				tableWidth = table.get('width'),
				tableHeight = table.get('height'),
				maxDim = tableWidth > tableHeight ? tableWidth : tableHeight;
				
			return editDim / (( maxDim + (2 * this.editShape.get('buffer'))) * this.units.displayFactor(UnitSystems.imperial));
		},

		transferGuests: function (fromShape, toShape, copy) {		
			if ( !toShape.seats && fromShape.seats) return;

			var l = Math.max(toShape.seats.length, fromShape.seats.length)

			for ( var i = 0; i < l; i++) {
				var fromSeat = fromShape.seats.at(i),
					toSeat = toShape.seats.at(i);

				this.transferGuestBetweenSeats(fromSeat, toSeat, copy);
			}
		},

		transferGuestBetweenSeats: function (fromSeat, toSeat, copy) {

			var fromGuest, toGuest;

			if ( toSeat ) {

				if (toGuest = toSeat.get('guest')) {				
					if (!fromSeat || !(fromGuest = fromSeat.get('guest'))) {						
						this.removeGuestFromSeat(toSeat);

					} else if (fromGuest && toGuest) {	
						if (toGuest != fromGuest && (this.editShape.cid === fromSeat.get('table').cid || fromSeat.get('table').cid === toSeat.get('table').cid)) {
							if (fromGuest.get('seat')) {
								this.swapGuests(fromSeat, toSeat);
							} else {
								this.moveGuestToSeat(fromGuest, toSeat);
							} 
						} else {

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
					if (!copy) {
						this.moveGuestToSeat(fromGuest, toSeat, fromSeat);
					} else {
						this.moveGuestToSeat(fromGuest, toSeat);
					}				
				}

			} else {
				if (fromSeat && (fromGuest = fromSeat.get('guest'))) {
					this.removeGuestFromSeat(fromSeat, fromGuest); // If edit new exits sans save 				
				}
			}

		},


		swapGuests: function (fromSeat, toSeat) {
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

			var toGuest;

			if (toGuest = toSeat.get('guest')) {
				this.removeGuestFromSeat(toSeat);
			}

			if (fromSeat) {
				fromSeat.unsetGuest(guest);
			}

			toSeat.setGuest(guest);	
		},


		removeGuestFromSeat: function (seat) {

			var guest;

			if (guest = seat.get('guest')) { 
				seat.unsetGuest(guest);
			}		
		},

		moveGuestToShapeByCid: function (gCid, tCid, sCid) {

			if (!this.guests || !this.editShape) return;

			var guest = this.guests.getByCid(gCid),
				seat = this.editShape.seats.getByCid(sCid);

			this.moveGuestToSeat(guest, seat);
		},

		removeGuestFromShapeByCid: function (tCid, sCid) {

			if (!this.shapes || !this.editShape) return;

			var table = (tCid == this.editShape.cid) ? this.editShape : this.shapes.getByCid(tCid),
				seat;
			if ( table && (seat = table.seats.getByCid(sCid)) ) this.removeGuestFromSeat(seat);
		},

		moveGuestFromShapeByCid: function (tCid, sCid) {

			if (!this.shapes || !this.editShape) return;

			var fromShape = this.shapes.getByCid(tCid) || this.editShape,
				fromSeat,
				fromGuest;

			if (fromSeat = fromShape.seats.getByCid(sCid)) {
				if (fromGuest = fromSeat.get('guest')) {
					this.set({ state: 'active move-guest'});
					this.moveGuest.set({ otCid: this.subjectShape.cid });
					this.moveGuest.set({ guest: fromGuest  });
				}
			}

		},

		transferGuestBetweenSeatsByCid: function (ptCid, psCid, tCid, sCid) {

			if (!this.shapes || !this.editShape) return;

			var fromShape = this.shapes.getByCid(ptCid) || this.editShape,
				toShape = this.shapes.getByCid(tCid) || this.editShape,
				fromSeat = fromShape.seats.getByCid(psCid),
				toSeat = toShape.seats.getByCid(sCid);

			if ( fromShape && toShape) {
				fromSeat = fromShape.seats.getByCid(psCid)
				toSeat = toShape.seats.getByCid(sCid)
				if (fromSeat && toSeat && fromSeat !== toSeat) {
					this.transferGuestBetweenSeats(fromSeat, toSeat);
				}
			}

		},

		transferGuestToShape: function(ptCid, psCid, tCid) {

			if (!this.shapes || !this.editShape) return;

			var fromShape = this.shapes.getByCid(ptCid) || this.editShape,
				toShape = this.shapes.getByCid(tCid) || this.editShape,
				fromSeat = fromShape.seats.getByCid(psCid),
				toSeat = toShape.getFirstEmptySeat(),
				toGuest;

			if ( fromShape && toShape) {
				fromSeat = fromShape.seats.getByCid(psCid)
				toSeat = toShape.getFirstEmptySeat()
				if (fromSeat && toSeat && fromSeat !== toSeat) {
					this.transferGuestBetweenSeats(fromSeat, toSeat);
				}
			}

			if (this.get('state') == 'active move-guest') {
				if (toGuest = toSeat.get('guest')) toGuest.save();
				this.set({ state: 'active' });
			}

		}
		
	});
	
	return EditShapeWithGuests;
	
});