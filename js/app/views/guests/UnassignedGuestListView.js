//$(function(){

UnassignedGuestListView = GuestListView.extend({
	
	householdLists: null,
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkSeat' );
		
		
		GuestListView.prototype.initialize.call(this, attrs);
		
		this.model.bind('change:seat', this.checkSeat);	
		this.model.each( this.checkSeat, this);
		this.householdLists = {};
	},
	
	addItem: function( model ) {
		
		var hId = model.get('household');
		
		if (!_(model).isUndefined() || !model.has('seat') ) {
			
			
			if (!this.householdLists[hId]) {
				this.householdLists[hId] = $('<ul></ul>').addClass(hId);
				$(this.el).append( this.householdLists[hId] );
			}
				
			if (!this.views[model.cid]) {
				this.views[model.cid] = this.factory.create(model);	
				this.householdLists[hId].append(this.views[model.cid].render().el);
				
			} else {
				$(this.views[model.cid].el).removeClass('assigned');
				$(this.views[model.cid].el).draggable('enable');	
			}
		} 
	},
	
	removeItem: function (model) {		
		var cid = model.cid;
		
		
		if (this.views.hasOwnProperty(cid)) {
			
			//this.views[model.cid].remove(); 
			$(this.views[model.cid].el).addClass('assigned');	
			$(this.views[model.cid].el).draggable('disable');					
		}
	},
	
	checkSeat: function (model) {		
		if (!_(model).isUndefined()) {
			
			if (model.has('seat')) {
				this.removeItem(model);
			} else {
				this.addItem(model);
			}
		}
	}
	
});

//});