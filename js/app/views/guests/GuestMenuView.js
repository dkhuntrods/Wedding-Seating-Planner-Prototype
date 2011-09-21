define(["app/views/base/ToggleMenuView", "libs/Backbone.Framework"], 

function(ToggleMenuView) {
    
	var GuestMenuView = ToggleMenuView.extend({

		templateId : '#guest-menu-template',
		
		render : function() {
			
			var seat = this.model.get('seat'),
				table;
			
			if (seat && (table = seat.get('table'))) {
				
				var template =_.template( $(this.templateId).html() ),
					gCid = this.model.cid,
					sCid = seat ? seat.cid : '',
					tCid = table ? table.cid : '',
					context = _.extend(this.model.toJSON(), { gCid: gCid, sCid: sCid, tCid: tCid });
			
				$(this.el).html( template( context ));	
				this.$('ul').hide();
				
			} else {
				
				$(this.el).empty();
			}
			
			return this;
		}	

	});
	
	return GuestMenuView;
	
});