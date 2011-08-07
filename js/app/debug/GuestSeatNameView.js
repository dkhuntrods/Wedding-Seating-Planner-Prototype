$(function() {

GuestSeatNameView = Backbone.View.extend({
	
	templateId: '#guest-name-template',
	
	initialize: function(attrs) {
        //console.log('[GuestSeatNameView] initialize');
		
		this.templateId = attrs.templateId || this.templateId;
		
        _.bindAll(this, 'render', 'removeView');		
   		if (this.model) this.setModel(this.model);		
    },
	
	setModel: function(model) {
		this.model = model;
		this.model.bind('change', this.render);
		this.model.bind('remove', this.removeView);
	},
		
	render: function() {
        console.log('[GuestSeatNameView] render', this.model.get('label'), this.model.get('seatSlot'), this.model.get('slot'));
		var template = _.template('<span>Table:<%= tCid %>, <%= tableId %> :: Seat:<%= sCid %> [<%= slot %>]</span>');
		var seat, table, ob = { sCid: 'None', tCid: 'None', tableId: this.model.get('tableId'), slot: this.model.get('seatSlot')};
		
		if (seat = this.model.get('seat')) {
			//console.log('seat', seat.cid);
			ob.sCid = seat.cid;
		}
		if (seat && (table = seat.get('table'))) {
			ob.tCid = table.cid;
		}
		
		//console.log(ob);
        $(this.el).html(template( ob ));
	
        return this;
    },

	removeView : function() {		
		this.remove();		
		this.model.unbind();
	}

});

});