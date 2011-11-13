define(["./UnassignedGuestListView", "app/factories/GuestFactory", "libs/Backbone.Framework"], 

function(UnassignedGuestListView, GuestFactory) {
    
	var UnassignedFilteredGuestView = Backbone.View.extend({

		selectedSide: -1,
		className: 'guest-filter',
		selectTemplateId: '#guest-filter-select',
		
		events: {
			'change select': 'handleSelectChange'
		},
		
		initialize: function (attrs) {
			
			var selectTemplate = _.template( $(this.selectTemplateId).html() );
			
			var gParams = {
				model: this.model.guests, 
				factory: new GuestFactory(), 
				tagName:'ul', 
				className: 'guest-list guest-list-unassigned',
				droppable: true,
				droppableParams: { accept: '.guest-list-assigned li' }
			};
			
			this.guestView = new UnassignedGuestListView(gParams);
			
			$(this.el).append(this.guestView.el);
			$(this.el).append(selectTemplate);
		},

		render: function() {
			this.guestView.render();
			return this;
		},
		
		handleSelectChange: function(event) {
			
			this.guestView.setFilter('side', event.target.value);
		}	
			
	});
	
	return UnassignedFilteredGuestView;
	
});