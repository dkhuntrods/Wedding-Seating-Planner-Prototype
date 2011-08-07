$(function(){

UnassignedGuestListView = GuestListView.extend({

	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkSeat' );
		console.log(attrs)
		
		GuestListView.prototype.initialize.call(this, attrs);
		
		this.model.bind('change:seat', this.checkSeat);	
		this.model.each( this.checkSeat, this);
	},
	
	addItem: function( model ) {
		console.log("[UnassignedGuestListView] addItem", model);
		
		if (!_(model).isUndefined() || !model.has('seat')) {		
			var view = this.factory.create(model);	
			this.views[model.cid] = view;		
			$(this.el).append(view.render().el);
			console.log(' adding guest view for', model.get('label'))
		} 
	},
	
	removeItem: function (model) {		
		var cid = model.cid;
		//console.log(this);
		console.log( '[UnassignedGuestListView] call removeItem', model.get('label'));
		if (this.views.hasOwnProperty(cid)) {
			console.log(' removing guest view for', model.get('label'))
			this.views[model.cid].remove(); 						
		}
	},
	
	checkSeat: function (model) {		
		if (!_(model).isUndefined()) {
			console.log( '[UnassignedGuestListView] checkSeat for', model.get('label'));
			if (model.has('seat')) {
				console.log(' has seat; removing guest view')
				this.removeItem(model);
			} else {
				console.log(' no seat; adding guest view')
				this.addItem(model);
			}
		}
	}
	
});

});