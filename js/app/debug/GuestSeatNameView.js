$(function() {

GuestSeatNameView = Backbone.View.extend({
	
	templateId: '#guest-name-template',
	
	initialize: function(attrs) {
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
        var template = _.template('<span>Table:<%= tCid %>, <%= tableId %> :: Seat:<%= sCid %> [<%= slot %>]</span>');
		var seat, table, ob = { sCid: 'None', tCid: 'None', tableId: this.model.get('tableId'), slot: this.model.get('seatSlot')};
		
		if (seat = this.model.get('seat')) {
			ob.sCid = seat.cid;
		}
		if (seat && (table = seat.get('table'))) {
			ob.tCid = table.cid;
		}
		
		$(this.el).html(template( ob ));
	
        return this;
    },

	removeView : function() {		
		this.remove();		
		this.model.unbind();
	}

});

});