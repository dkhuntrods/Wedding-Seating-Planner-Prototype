define(["libs/Backbone.Framework"], 

function() {
    
	var RootGuestView = Backbone.View.extend({
		
		className: 'guest',

		initialize: function(attrs) {
			_.bindAll(this, 'render', 'setData');

			this.draggable = attrs.draggable;
			this.draggableParams = attrs.draggableParams;
			this.droppable = attrs.droppable;
			this.droppableParams = attrs.droppableParams;

			if (this.draggable) $(this.el).draggable(this.draggableParams);
			if (this.droppable) $(this.el).droppable(this.droppableParams);

			this.model.bind('remove', this.removeViews );
			this.model.bind('change', this.setData );
			this.setData();
		},

		render: function() {				
			return this;		
		},

		removeViews: function () {		

			this.remove();
		},	

		setData: function () {

			var m = this.model,
				seat,
				table,
				gCid = m.cid,
				sCid = '', 
				tCid = '';

			if (seat = m.get('seat')) {			
				sCid = seat.cid;
				if (table = seat.get('table')) {
					tCid = table.cid;
				}
			}			

			$(this.el).data({ gCid: gCid, sCid: sCid, tCid: tCid });
		}
		
	});
	
	return RootGuestView;
	
});