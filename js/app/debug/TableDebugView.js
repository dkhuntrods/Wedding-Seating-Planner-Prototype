$(function() {

TableDebugView = Backbone.View.extend({
	
	templateId: '#guest-name-template',
	tagName: 'li',
	
	initialize: function(attrs) {
        console.log('[TableDebugView] initialize', this.model);
		
        _.bindAll(this, 'render', 'removeView', 'setSeatHandlers');		
   		if (this.model) this.setModel(this.model);		
    },
	
	setModel: function(model) {
		this.model = model;
		this.model.bind('change', this.render);
		this.model.bind('change:seats', this.setSeatHandlers);
		this.model.bind('change:seatSlots', this.render);
		
		this.model.bind('remove', this.removeView);
		this.setSeatHandlers(this.model);
	},
	
	setSeatHandlers: function (model) {
		var seats;
		console.log('	setSeatHandlers');
		if (seats = model.seats) {
			seats.bind('change', this.render);
			seats.bind('change:guest', this.render);
		}
	},
		
	render: function() {
        //console.log('[TableDebugView] render', this.model.get('id'));
		var templateString = '<em><%= name %> (<%= cid %>, <%=id %>)</em> <%= type %>  :: [<%= seatSlots %>] <%= nSeats %> seat(s)';
		var seats, guest;
		
		if (seats = this.model.seats) {
			//console.log('seat', seats.cid);
			templateString+='<p><%= seatsCid %>:</p><ul></ul>';
			//ob.sCid = seat.cid;
		}
		
		var template = _.template(templateString);
		var stemplate = _.template('<li><em><%= sCid %> [<%= slot %>]</em><%= type %>, <%= label %></li>');
		
		var ob = { name: this.model.get('name'), id: this.model.get('id'), cid: this.model.cid, seatsCid: this.model.seats.cid, type: this.model.get('type').name, seatSlots: this.model.get('seatSlots'), nSeats: this.model.seats.length };
		var sb = { slot: [], sCid: '', type: '', label: 'None' }
		/*
		if (seat && (table = seat.get('table'))) {
			ob.tCid = table.cid;
		}
		*/
		//console.log(ob);
        $(this.el).html(template( ob ));
		
		seats.each( function (seat) {
			sb.slot = seat.get('slot');
			sb.sCid = seat.cid;
			sb.type = seat.get('type');
			
			if (guest = seat.get('guest')) {				
				sb.label = guest.get('label');
			} else {
				sb.label = 'None';
			}
			$(this.el).find('ul').append(stemplate( sb ));
		}, this);
		
        return this;
    },

	removeView : function() {		
		this.remove();		
		this.model.unbind();
	}

});

});