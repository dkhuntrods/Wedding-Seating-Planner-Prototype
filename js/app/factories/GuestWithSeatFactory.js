function GuestWithSeatFactory() {};

GuestWithSeatFactory.prototype = {

	create : function (guest) {
		var attrs = {
			model: guest,
			tagName: 'li',
			className: 'guest',
			draggable: true,
			draggableParams: { stack : '.guest>li', revert: 'invalid', revertDuration: 200, helper: 'clone', appendTo: 'body', cursorAt: { top:5, left: -8 } }
		};

		var guestView = new RootGuestWithSeatView(attrs);
		var nameView = new GuestNameView({ model: guest });
		//var menuView = new GuestMenuView({ model: guest });
		var iconView = new GuestMenuView({ model: guest, templateId:'#guest-menu-template', className:'menu', toggleable:true });

		$(guestView.el).append( nameView.render().el );
		//$(guestView.el).append( menuView.render().el );
		$(guestView.el).append( iconView.render().el );
		
		return guestView;
	}
};