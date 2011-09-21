SeatTypes = {
	INIT: SHAPE_INIT_ID,
	ADULT_FEMALE: 11,	
	ADULT_MALE: 12,
	CHILD_FEMALE: 21,
	CHILD_MALE: 22
};


define(["./Shape", "libs/Backbone.Framework"], 

function(Shape) {
    
	var Seat = Shape.extend({
		
		defaults: {
			x: 0,
			y: 0,
			rotation: 0,
			type: null,
			units: null,
			width: 15,
			height: 15,
			type: SeatTypes.INIT,
			table: null,
			slot: [],
			guest: null
		},

		initialize: function (attrs) {		

			_.bindAll(this, 'handleGuestChange', 'bindHandlers');

			this.bindHandlers();
		},

		bindHandlers: function() {
			this.bind('change:guest', this.handleGuestChange);
		},

		setGuest: function(guest) {

			var guest, type;
			if (guest != this.get('guest')) {

				type = guest.get('ageRange') + '' + guest.get('gender');
				guest.setSeat(this);
				this.set({ guest: guest });
			}		
		},

		unsetGuest: function(guest) {
			var oGuest = this.get('guest');
			var gl = oGuest && oGuest.get('label');
			var gl2 = guest && guest.get('label');

			if (guest === oGuest) {

				oGuest.unsetSeat(this);
				this.unset('guest');
			}
		},

		handleGuestChange: function() {

			var guest, type;

			if ( guest = this.get('guest') ){			
				type = guest.get('ageRange') + '' + guest.get('gender');
			} else {
				type = SeatTypes.INIT;			
			}

			this.set({ type: type });

		},

		toJSON : function() {

			var a = this.attributes;
			return {
				"rotation":a.rotation,
	            "type":a.type,
	            "slot":a.slot
			};
	    }
		
	});

	return Seat;

});