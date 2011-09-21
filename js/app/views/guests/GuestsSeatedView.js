define(["libs/Backbone.Framework"], 

function() {
    
	var GuestsSeatedView = Backbone.View.extend({
		
		totalGuests: 0,
		seatedGuests: 0,
		templateId: '#total-guests-seated-guests-template',
		className: 'guests-seated',

		initialize: function (attrs) {
			_.bindAll(this, 'render', 'reset', 'checkSeats' );

			this.templateId = attrs.templateId || this.templateId;

			this.model.bind('change:seat', this.render);
		},

		reset: function () {

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

			this.reset();
			return this;
		},

		checkSeats: function (model) {		
			var seatedGuests = this.model.filter( function (guest) { return guest.has('seat') });
			return seatedGuests.length;			
		}
		
	});
	
	return GuestsSeatedView;
	
});