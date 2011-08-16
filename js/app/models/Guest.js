var Guest = Person.extend({
	
	
    defaults: _(Person.prototype.defaults).extend( {
       	seat: null,
		household: 'h1'
    }),
	
	
    initialize: function(attrs) {
        //console.log('[Guest] initialize' , Person.prototype.defaults);
		Person.prototype.initialize.call(this, attrs);
		
		if (attrs.seat) setSeat(attrs.seat);		
    },	
	
	setSeat: function (seat) {
		var tableId = seat.get('table') && seat.get('table').get('id');
		var eSeat = this.get('seat') && this.get('seat').get('slot')
		console.log('[Guest] setSeat', 'tableId', tableId, ', seat', seat.cid, ', guest', this.get('label'));
		if (seat != this.get('seat')) {
			console.log('	setSeat successful', seat.get('slot'), eSeat);
			this.set({ seat:seat, tableId: tableId, seatSlot: seat.get('slot') });
		}
	},
	
	unsetSeat: function (seat) {
		var table = this.get('seat') && this.get('seat').get('table') && this.get('seat').get('table').get('id');
		var sCid = seat && seat.cid;
		var tsCid = this.get('seat') && this.get('seat').cid
		console.log('[Guest] unsetSeat', 'table', table, ', seats:', sCid, tsCid, ', guest', this.get('label'));
		if (seat === this.get('seat')) {	
			console.log('	unsetSeat successful');			
			//this.seat = null;
			this.unset('seat');
			this.unset('tableId');
			this.unset('seatSlot');
		}
		
	}

});