MoveGuest = Backbone.Model.extend({
	
	defaults : {
		guest: null,
		shapes: null,
		otCid: ''
	},
	
	initialize: function () {
		console.log('[MoveGuest] initialize');
		_.bindAll(this, 'handleGuestChanged', 'handleCidChanged');
		this.bind('change:guest', this.handleGuestChanged);
		this.bind('change:otCid', this.handleCidChanged);
	},
	
	handleGuestChanged: function () {
		var guest;
		console.log('handleGuestChanged');
		if (guest = this.get('guest')) {
			console.log('Guest to move:', guest.get('label'));
		} else {
			console.log('No guest to move');
		}
	},
	
	handleCidChanged: function () {
		console.log('handleGuestChanged');
		if (otCid = this.get('otCid')) {
			console.log('otCid:', otCid);
		} else {
			console.log('No otCid');
		}	
	}
});