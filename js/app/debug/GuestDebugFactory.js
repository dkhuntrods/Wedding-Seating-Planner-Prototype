function GuestDebugFactory() {};

GuestDebugFactory.prototype = {

	create : function (guest) {
	
		var attrs = {
			model: guest,
			tagName: 'li',
			className: 'guest',
			draggable: true,
			draggableParams: { stack : '.guest>li', revert: 'invalid', revertDuration: 200, helper: 'clone', appendTo: 'body', cursorAt: { top:5, left: -8 } }
		};
	
		var guestView = new RootGuestView(attrs);
		var nameView = new GuestNameView({ model: guest });
		var seatView = new GuestSeatNameView({ model: guest });
		
		$(guestView.el).append( nameView.render().el );
		$(guestView.el).append( seatView.render().el );
	
		return guestView;
	}
};