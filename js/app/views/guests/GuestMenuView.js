$(function(){

	GuestMenuView = ToggleMenuView.extend({

		templateId : '#guest-menu-template',
		
		render : function() {
			//console.log('[GuestMenuView] render');
			
			var seat = this.model.get('seat'),
				table;
			
			if (seat && (table = seat.get('table'))) {
				//console.log('seat is', seat, table)
				var template =_.template( $(this.templateId).html() ),
					gCid = this.model.cid,
					sCid = seat ? seat.cid : '',
					tCid = table ? table.cid : '',
					context = _.extend(this.model.toJSON(), { gCid: gCid, sCid: sCid, tCid: tCid });
			
				//console.log(context);
			
				$(this.el).html( template( context ));	
				this.$('ul').hide();
				
			} else {
				
				$(this.el).empty();
			}
			
			return this;
		},	

	});

});