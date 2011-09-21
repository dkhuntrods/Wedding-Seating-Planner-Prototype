define(["libs/Backbone.Framework"], 

function() {
    
	var AssignedGuestListView = Backbone.View.extend({
		
		className: 'guest-list guest-list-assigned',
		tagName: 'ul',

		initialize: function (attrs) {
			_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkGuest', 'checkGuests', 'checkClass', 'handleReset' );

			this.views = {};

			this.draggable = attrs.draggable;
			this.draggableParams = attrs.draggableParams;
			this.droppable = attrs.droppable;
			this.droppableParams = attrs.droppableParams;

			if (this.draggable) $(this.el).draggable(this.draggableParams);
			if (this.droppable) $(this.el).droppable(this.droppableParams);	

			this.factory = attrs.factory;

			this.model.bind('change:seats', this.checkGuests);

			this.checkGuests(this.model);
			this.checkClass();

		},

		reset: function () {

			$(this.el).empty();
			this.views = {};

			if (this.model.seats.length > 0) {
				this.model.seats.each ( this.checkGuest, this );
			} 

		},

		render : function () {

			this.reset();
			return this;
		},

		addItem: function( model ) {

			if (model.has('guest')) {		
				var view = this.factory.create(model.get('guest'));			
				this.views[model.cid] = view;		
				$(this.el).append(view.render().el);

			} 
		},

		removeItem: function (model) {		
			var cid = model.cid;

			if (this.views.hasOwnProperty(cid)) {

				this.views[model.cid].remove(); 						
			}
		},

		checkGuests: function (model) {

			var seats;
			if (seats = model.seats) {
				seats.bind('change:guest', this.checkGuest);
				seats.bind('change:guest', this.checkClass);
				seats.bind('reset',this.handleReset);
				seats.each( this.checkGuest );
			}

		},

		handleReset: function (seats) {

			this.reset();
		},

		checkGuest: function (model) {

			if (model.has('guest') && model.get('guest').get('seat').get('table').cid == this.model.cid) {
				this.addItem(model);
			} else {
				this.removeItem(model);			
			}
		},

		checkClass: function () {

			var seats, guests;
			if (seats = this.model.seats) {
				guests = seats.filter ( function (seat) { return seat.has('guest') });
			}

			if ( guests.length > 0){
				$(this.el).removeClass('inactive').addClass('active');
			} else {
				$(this.el).removeClass('active').addClass('inactive');
			}

		}
		
	});
	
	return AssignedGuestListView;
	
});