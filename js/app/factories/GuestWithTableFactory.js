define(["app/views/guests/RootGuestWithSeatView", "app/views/guests/GuestNameAbbrView", "app/views/guests/GuestMenuView", 
		"libs/Backbone.Framework"], 

function(RootGuestWithSeatView, GuestNameAbbrView, GuestMenuView) {
    
	function GuestWithTableFactory() {};

	GuestWithTableFactory.prototype = {

		create : function (guest) {
			/*
			var attrs = {
				model: guest,
				tagName: 'li',
				className: 'guest'
			};
			*/
			
			var attrs = {
				model: guest,
				tagName: 'li',
				className: 'guest'
			};

			var guestView = new RootGuestWithSeatView(attrs);
			
			//var guestView = new RootGuestView(attrs);
			//var menuView = new GuestMenuView({ model: guest, templateId:'#guest-icon-delete-template', className:'menu menu-inline', toggleable: false });
			var nameView = new GuestNameAbbrView({ model: guest });
			
			//$(guestView.el).append( menuView.render().el );
			$(guestView.el).append( nameView.render().el );

			return guestView;
		}
	};
	
	return GuestWithTableFactory;
	
});