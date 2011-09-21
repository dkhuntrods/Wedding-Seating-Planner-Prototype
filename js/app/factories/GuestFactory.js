define(["app/views/guests/RootGuestView", "app/views/guests/GuestNameView", 
		"app/views/guests/GuestIconView", "app/views/guests/GuestMenuView", 
		"libs/Backbone.Framework"], 

function(RootGuestView, GuestNameView, GuestIconView, GuestMenuView) {
    
	function GuestFactory() {};

	GuestFactory.prototype = {

		create : function (guest) {

			var attrs = {
				model: guest,
				tagName: 'li',
				className: 'guest',
				draggable: true,
				draggableParams: { stack : '.guest>li', revert: 'invalid', revertDuration: 200, helper: 'clone', appendTo: 'body', cursorAt: { top:5, left: -20 } }
			};

			var guestView = new RootGuestView(attrs);
			var nameView = new GuestNameView({ model: guest });
			var iconView = new GuestIconView({ model: guest });

			$(guestView.el).append( iconView.render().el );
			$(guestView.el).append( nameView.render().el );

			return guestView;
		}
	};
	
	return GuestFactory;
	
});