$(function(){

AssignedGuestListView = Backbone.View.extend({
	
	className: 'guest-list guest-list-assigned',
	tagName: 'ul',
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkGuest', 'checkGuests', 'checkClass', 'handleReset' );
		console.log('AssignedGuestListView', attrs)
		this.views = {};
		
		this.draggable = attrs.draggable;
		this.draggableParams = attrs.draggableParams;
		this.droppable = attrs.droppable;
		this.droppableParams = attrs.droppableParams;
		
		if (this.draggable) $(this.el).draggable(this.draggableParams);
		if (this.droppable) $(this.el).droppable(this.droppableParams);	
			
		this.factory = attrs.factory;
		
		this.model.bind('change:seats', this.checkGuests);
		//this.model.seats.bind('reset', this.handleReset);
		
		this.checkGuests(this.model);
		this.checkClass();
		console.log('this.factory', this.factory)
		
	},
	
	reset: function () {
		//console.log('[AssignedGuestListView] reset')
		//emptyTemplate = _.template($(this.emptyMessageTemplateId).html()),
		
		$(this.el).empty();
		this.views = {};
		
		if (this.model.seats.length > 0) {
			this.model.seats.each ( this.checkGuest, this );
		} 
		//console.log('exit reset');
	},
	
	render : function () {
		//console.log("[AssignedGuestListView] render");
		
		this.reset();
		return this;
	},
	
	addItem: function( model ) {
		//console.log("[AssignedGuestListView] addItem", model.cid);
		
		if (model.has('guest')) {		
			var view = this.factory.create(model.get('guest'));			
			this.views[model.cid] = view;		
			$(this.el).append(view.render().el);
			console.log('  adding guest view for', model.get('guest').get('label'))
		} 
	},
	
	removeItem: function (model) {		
		var cid = model.cid;
		//console.log( '[AssignedGuestListView] removeItem', model.cid, this.views);
		if (this.views.hasOwnProperty(cid)) {
			console.log('  removing guest view for', cid)
			this.views[model.cid].remove(); 						
		}
	},
	
	checkGuests: function (model) {
		//console.log('checkGuests', model);
		var seats;
		if (seats = model.seats) {
			seats.bind('change:guest', this.checkGuest);
			seats.bind('change:guest', this.checkClass);
			seats.bind('reset',this.handleReset);
			seats.each( this.checkGuest );
		}
		
	},
	
	handleReset: function (seats) {
		//console.log('[AssignedGuestListView] handleReset');
		this.reset();
	},
	
	checkGuest: function (model) {
		console.log( '[AssignedGuestListView] checkGuest for', model.get('guest'));
		if (model.has('guest') && model.get('guest').get('seat').get('table').cid == this.model.cid) {
			console.log('  has guest; adding guest view')
			this.addItem(model);
		} else {
			console.log('  no guest; removing guest view')
			this.removeItem(model);			
		}
	},
	
	checkClass: function () {
		//console.log( '[AssignedGuestListView] checkClass');
		var seats, guests;
		if (seats = this.model.seats) {
			guests = seats.filter ( function (seat) { return seat.has('guest') });
		}
		//console.log(guests, guests.length);
		if ( guests.length > 0){
			$(this.el).removeClass('inactive').addClass('active');
		} else {
			$(this.el).removeClass('active').addClass('inactive');
		}
		
	}
	
});

});