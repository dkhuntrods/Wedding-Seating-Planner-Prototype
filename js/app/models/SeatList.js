SeatList = Backbone.Collection.extend({
	
	model: Seat,
	seatPool: [],
	name: '',
	
	initialize: function () {
		this.bind('reset', this.handleReset);
	},
	
	getSeatAtSlot: function (slot) {
		return this.find( function (seat) {
			//console.log(seat.get('slot'), slot, _.isEqual(seat.get('slot'), slot));
			return _.isEqual(seat.get('slot'), slot);
		});
	},
	/*
	comparator: function (seat) {
		return seat.get('slot');
	},
	*/
	handleReset: function () {
		console.log('[SeatList] handleReset', this.cid);
	},
	
	updateSeats: function (seatList) {
		console.log('updating seats:', this.cid);
		
		for ( var i = 0; i < seatList.length; i++) {
			//var slot = seatList[i].slot;
			//var seat = this.getSeatAtSlot(slot);
			
			//this.add(new Seat(seatList[i]))
			console.log('	seatlist[',i,']:', seatList[i]);
			/*
			console.log('	seat 1:', seat, slot);
			if ( _(seat).isUndefined() ) {
				seat = this.seatPool.pop() || new Seat(seatList[i]);
				console.log('		seat a:', seat, seatList[i]);
				this.add( seat.set(seatList[i]) );
				//this.trigger('add', seat);
			} else {
				
				seat.set(seatList[i]);
				console.log('		seat b:', seat);
			} 
			*/
			if ( _(this.at(i)).isUndefined() ) {
				var seat = this.seatPool.pop() || new Seat(seatList[i]);
				console.log('		seatpool or new seat:', seat, seatList[i]);
				this.add( seat.set(seatList[i]));
				this.trigger('add', seat);
			} else {
				this.at(i).set(seatList[i]);
				console.log('		resetting existing seat:', this.at(i), seatList[i]);
			}
			
		}

		while( this.length > seatList.length)	{			
			console.log('	>> removing seat', this.length);				
			this.seatPool[this.seatPool.length] = this.last();				
			this.remove(this.last());
		}
		
		
	}
});