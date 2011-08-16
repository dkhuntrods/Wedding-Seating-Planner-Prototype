$(function(){

UnassignedGuestListView = GuestListView.extend({
	
	householdLists: null,
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkSeat' );
		console.log(attrs)
		
		GuestListView.prototype.initialize.call(this, attrs);
		
		this.model.bind('change:seat', this.checkSeat);	
		this.model.each( this.checkSeat, this);
		this.householdLists = {};
	},
	
	addItem: function( model ) {
		console.log("[UnassignedGuestListView] addItem", model, model.get('household'));
		var hId = model.get('household');
		
		if (!_(model).isUndefined() || !model.has('seat') ) {
			//console.log( $('<ul></ul>').addClass(hId) );
			
			if (!this.householdLists[hId]) {
				this.householdLists[hId] = $('<ul></ul>').addClass(hId);
				$(this.el).append( this.householdLists[hId] );
			}
				
			if (!this.views[model.cid]) {
				this.views[model.cid] = this.factory.create(model);	
				this.householdLists[hId].append(this.views[model.cid].render().el);
				console.log(' adding guest view for', model.get('label'))
			} else {
				$(this.views[model.cid].el).removeClass('assigned');
				$(this.views[model.cid].el).draggable('enable');	
			}
		} 
	},
	
	removeItem: function (model) {		
		var cid = model.cid;
		//console.log(this);
		console.log( '[UnassignedGuestListView] call removeItem', model.get('label'));
		if (this.views.hasOwnProperty(cid)) {
			console.log(' removing guest view for', model.get('label'))
			//this.views[model.cid].remove(); 
			$(this.views[model.cid].el).addClass('assigned');	
			$(this.views[model.cid].el).draggable('disable');					
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