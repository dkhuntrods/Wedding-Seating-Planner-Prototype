SeatTypes = {
	INIT: SHAPE_INIT_ID,
	ADULT_FEMALE: 11,	
	ADULT_MALE: 12,
	CHILD_FEMALE: 21,
	CHILD_MALE: 22
};

Seat = Shape.extend({
	
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
		//console.log('[Seat] init');	
		_.bindAll(this, 'handleRemoved', 'handleGuestChange');
		
		this.bind('remove', this.handleRemoved);
		this.bind('change:guest', this.handleGuestChange);
	},
	
	setGuest: function(guest) {
		console.log('[Seat] setGuest', 'table', this.get('table').get('id'), ', seat', this.cid, ', guest', guest.get('label'));
		var guest, type;
		if (guest != this.get('guest')) {
			console.log('	setGuest successful');			
			type = guest.get('gender') + '' + guest.get('ageRange');
			guest.setSeat(this);
			this.set({ guest: guest });		
		}		
	},
	
	unsetGuest: function(guest) {
		var oGuest = this.get('guest');
		var gl = oGuest && oGuest.get('label');
		var gl2 = guest && guest.get('label');
		console.log('[Seat] unsetGuest', 'table', this.get('table').get('id'), ', seat', this.cid, ', guests:', gl2, gl);		
		if (guest === oGuest) {
			console.log('	unsetGuest successful', this.get('type'), SeatTypes.INIT);
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
		console.log('set type:', type);
		this.set({ type: type });
	
	},
	
	handleRemoved: function () {
		var cid = this.guest ? this.guest.cid : '';
			
		console.log('[Seat] handleRemoved', 'cid:', cid);
		
		/* Changed
		if (this.guest) {
			console.log('	removing guest');
			this.unsetGuest(this.guest);
		}
		*/		
	},
	
	toJSON : function() {
      	console.log('seat toJSON')
		var a = this.attributes;
		return {
			"rotation":a.rotation,
            "type":a.type,
            "slot":a.slot
			};
    },
	
});