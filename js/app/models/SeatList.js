SeatList = Backbone.Collection.extend({
	
	model: Seat,
	seatPool: [],
	name: '',
	
	initialize: function () {
		this.bind('reset', this.handleReset);
	},
	
	getSeatAtSlot: function (slot) {
		return this.find( function (seat) {
			
			return _.isEqual(seat.get('slot'), slot);
		});
	},
	/*
	comparator: function (seat) {
		return seat.get('slot');
	},
	*/
	handleReset: function () {
		
	},
	
	updateSeats: function (seatList) {
		
		var seat;
		
		for ( var i = 0; i < seatList.length; i++) {
			//var slot = seatList[i].slot;
			//var seat = this.getSeatAtSlot(slot);
			
			//this.add(new Seat(seatList[i]))
			
			/*
			
			if ( _(seat).isUndefined() ) {
				seat = this.seatPool.pop() || new Seat(seatList[i]);
				
				this.add( seat.set(seatList[i]) );
				//this.trigger('add', seat);
			} else {
				
				seat.set(seatList[i]);
				
			} 
			*/
			if ( _(this.at(i)).isUndefined() ) {
				seat = this.seatPool.pop() || new Seat(seatList[i]);
				
				seat.bindHandlers();
				this.add( seat.set(seatList[i]));
				//this.trigger('add', seat);
			} else {
				seat = this.at(i);
				seat.bindHandlers();
				seat.set(seatList[i]);
				
			}
			
		}

		while( this.length > seatList.length)	{			
							
			this.seatPool[this.seatPool.length] = this.last();				
			this.remove(this.last());
		}
		
		
	}
});