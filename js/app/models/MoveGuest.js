define(["libs/Backbone.Framework"], 

function() {
    
	var MoveGuest = Backbone.Model.extend({
		
		defaults : {
			guest: null,
			shapes: null,
			otCid: ''
		},

		initialize: function () {

			_.bindAll(this, 'handleGuestChanged', 'handleCidChanged');
			this.bind('change:guest', this.handleGuestChanged);
			this.bind('change:otCid', this.handleCidChanged);
		},

		handleGuestChanged: function () {
			var guest;

			if (guest = this.get('guest')) {

			} else {

			}
		},

		handleCidChanged: function () {

			if (otCid = this.get('otCid')) {

			} else {

			}	
		}
		
	});
	
	return MoveGuest;
	
});