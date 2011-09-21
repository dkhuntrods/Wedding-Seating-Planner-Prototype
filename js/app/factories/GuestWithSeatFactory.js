define(["app/views/guests/RootGuestWithSeatView", "app/views/guests/GuestNameView", "app/views/guests/GuestMenuView", 
		"libs/Backbone.Framework"], 

function(RootGuestWithSeatView, GuestNameView, GuestMenuView) {
    
	function GuestWithSeatFactory() {};

	GuestWithSeatFactory.prototype = {

		create : function (guest) {
			var attrs = {
				model: guest,
				tagName: 'li',
				className: 'guest',
				draggable: true,
				draggableParams: { stack : '.guest>li', revert: 'invalid', revertDuration: 200, helper: 'clone', appendTo: 'body', cursorAt: { top:5, left: 40 } }
			};

			var guestView = new RootGuestWithSeatView(attrs);
			var nameView = new GuestNameView({ model: guest });
			var iconView = new GuestMenuView({ model: guest, templateId:'#guest-menu-template', className:'menu', toggleable:true });

			$(guestView.el).append( nameView.render().el );
			$(guestView.el).append( iconView.render().el );

			return guestView;
		}
	};
	
	return GuestWithSeatFactory;
	
});