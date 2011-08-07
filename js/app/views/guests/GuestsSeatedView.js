$(function(){

GuestsSeatedView = Backbone.View.extend({
	
	totalGuests: 0,
	seatedGuests: 0,
	templateId: '#total-guests-seated-guests-template',
	className: 'guests-seated',
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'checkSeats' );
		//console.log(attrs)
		this.templateId = attrs.templateId || this.templateId;
		
		this.model.bind('change:seat', this.render);	
		//this.model.each( this.checkSeat, this);
	},
	
	reset: function () {
		//console.log('[GuestsSeatedView] reset')
		var template = _.template( $(this.templateId).html() );
		
		$(this.el).empty();
		
		if (this.model.length > 0) {
			this.totalGuests = this.model.length;
			this.seatedGuests = this.checkSeats();
			$(this.el).html( template({ seated: this.seatedGuests, total: this.totalGuests }) );
		} else {
			this.totalGuests = 0;
			this.seatedGuests = 0;
			$(this.el).empty();
		}
	},
	
	render : function () {
		//console.log("[GuestsSeatedView] render");
		
		this.reset();
		return this;
	},
	
	checkSeats: function (model) {		
		var seatedGuests = this.model.filter( function (guest) { return guest.has('seat') });
		return seatedGuests.length;
		/*
		if (!_(model).isUndefined()) {
			console.log( '[GuestsSeatedView] checkSeat for', model.get('label'));
			if (model.has('seat')) {
				console.log(' has seat; adding')
				this.seatedGuests++;
			} else {
				console.log(' no seat; subtracting')
				this.seatedGuests--;
			}
		}
		*/
	}
	
});

});