function GuestWithTableFactory() {};

GuestWithTableFactory.prototype = {

	create : function (guest) {
	
		var attrs = {
			model: guest,
			tagName: 'li',
			className: 'guest'
		};
	
		var guestView = new RootGuestView(attrs);
		var nameView = new GuestNameView({ model: guest });
		var menuView = new GuestMenuView({ model: guest, templateId:'#guest-icon-delete-template', className:'menu menu-inline', toggleable: false });
	
		$(guestView.el).append( nameView.render().el );
		$(guestView.el).append( menuView.render().el );
	
		return guestView;
	}
};