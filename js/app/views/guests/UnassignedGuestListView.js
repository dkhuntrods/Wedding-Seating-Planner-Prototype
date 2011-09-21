define(["./GuestListView", "libs/Backbone.Framework"], 

function(GuestListView) {
    
	var UnassignedGuestListView = GuestListView.extend({

		householdLists: null,
		filterType: null,
		filterValue: null,

		initialize: function (attrs) {
			_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'checkSeat' );

			GuestListView.prototype.initialize.call(this, attrs);

			this.model.bind('change:seat', this.checkSeat);	
			this.model.each( this.checkSeat, this);
			this.householdLists = {};
		},

		addItem: function( model ) {

			var hid = model.get('household'),
				cid = model.cid;

			if (!_(model).isUndefined() || !model.has('seat') ) {

				if (!this.householdLists[hid]) {
					this.householdLists[hid] = $('<ul></ul>').addClass(hid);
					$(this.el).append( this.householdLists[hid] );
				}

				if (!this.views[cid]) {
					this.views[cid] = this.factory.create(model);	
					this.householdLists[hid].append(this.views[cid].render().el);

				} else {
					$(this.views[cid].el).removeClass('assigned');
					$(this.views[cid].el).draggable('enable');	
				}
			} 
		},

		removeItem: function (model) {		
			
			if (!_(model).isUndefined()) {
				
				var cid = model.cid;

				if (this.views.hasOwnProperty(cid)) {

					$(this.views[cid].el).addClass('assigned');	
					$(this.views[cid].el).draggable('disable');					
				}
			}
		},

		checkSeat: function (model) {		
			
			if (!_(model).isUndefined()) {
				
				var cid = model.cid;
				
				if (model.has('seat')) {
					this.removeItem(model);
				} else {
					this.addItem(model);
				}
				
				if (!this.filterType || !this.filterValue || this.filterValue == -1) {
					$(this.views[cid].el).removeClass('hidden');
					
				} else {
					if (model.get(this.filterType) == this.filterValue) {
						$(this.views[cid].el).removeClass('hidden');	
					} else {
						$(this.views[cid].el).addClass('hidden');
					}
					
				}
				
			}
			
		},
		
		setFilter: function(type, value) {
			this.filterType = type;
			this.filterValue = value;
			this.model.each( this.checkSeat, this);
		}

	});
	
	return UnassignedGuestListView;
	
});