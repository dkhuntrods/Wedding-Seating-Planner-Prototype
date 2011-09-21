define(["./Seat", "libs/Backbone.Framework"], 

function(Seat) {
    
	var SeatList = Backbone.Collection.extend({
		
		model: Seat,
		seatPool: [],
		name: '',

		getSeatAtSlot: function (slot) {
			return this.find( function (seat) {
				return _.isEqual(seat.get('slot'), slot);
			});
		},
		
		
		hasCurrentSlot: function (seat, seatList) {
			return _(seatList).find( function (item) {
				return _.isEqual(item.slot, seat.get('slot'));
			});
		},
		
		updateSeats: function (seatList, seatSlots) {

			var seat,
				seatsForRemoval = [];

			for ( var i = 0; i < seatList.length; i++) {
				
				var slot = seatList[i].slot,
					seat = this.getSeatAtSlot(slot);
				
				if ( _(seat).isUndefined() ) {
					seat = this.seatPool.pop() || new Seat(seatList[i]);
					seat.bindHandlers();
					this.add( seat.set(seatList[i]) );
				} else {
					seat.bindHandlers();
					seat.set(seatList[i]);					
				}				
			}
			
			this.each( function(seat){
				if (!this.hasCurrentSlot(seat, seatList)) {					
					seatsForRemoval.push(seat);					
				} 
			}, this);
			
			_(seatsForRemoval).each( function(seat) {
				
				if ( seat.has('guest') ) seat.unsetGuest(seat.get('guest'));
				this.remove(seat);
				
			}, this); 
			
		},
		
		comparator: function (seat) {
			return seat.get('slot');
		}
		
		
		
	});

	return SeatList;

});