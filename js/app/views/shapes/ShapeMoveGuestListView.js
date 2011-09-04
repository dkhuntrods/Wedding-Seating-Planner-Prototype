$(function(){

ShapeMoveGuestListView = Backbone.View.extend({

	className: 'shape-list',
	templateId: '#guest-move-template',
	views: {},
	
	initialize: function (attrs) {
		console.log('[ShapeMoveGuestListView]')
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem' );
		
		this.model.bind('change:shapes', this.addShapeHandlers);
		this.model.bind('change:guest', this.reset);
		this.model.bind('change:otCid', this.reset);
		this.addShapeHandlers();
		
		this.factory = attrs.factory;
	},
	
	addShapeHandlers: function () {
		var shapes;
		
		if (shapes = this.model.get('shapes')) {
			shapes.bind('add', this.addItem);
			shapes.bind('remove', this.removeItem);
			shapes.bind('reset', this.reset);
		} 
	},
	
	reset: function () {
		console.log("[ShapeMoveGuestListView] reset");
		var template, guest;
		
		if (guest = this.model.get('guest')) {
			template = _.template( $(this.templateId).html() );
			$(this.el).html( template({ label: guest.get('label')}) );
		
			if (this.model.get('shapes') && this.model.get('shapes').length > 0 ) {
				this.$('ul').empty();
				this.model.get('shapes').each ( this.addItem, this );
			} 
		} else {
			$(this.el).empty();
		}
	},
	
	render : function () {
		console.log("[ShapeMoveGuestListView] render");
		
		this.reset();
		return this;
	},
	
	addItem : function( model ) {
		console.log("[ShapeMoveGuestListView] addItem");
		var guest, seat, table, 
			tCid = '', sCid = '', otCid;
		
		if (guest = this.model.get('guest')) {
			if (seat = guest.get('seat')) {
				if (table = seat.get('table')) {
					tCid = table.cid;
					sCid = seat.cid;
					otCid = this.model.get('otCid');
					//console.log(tCid, model.cid, this.model.get('otCid'), seat.previous('table').cid);					
				}
			}			
		}
		
		
		if (otCid != model.cid && model.getFirstEmptySeat()) {
			var view = new ShapeMoveGuestView({ model:model, tCid: tCid, sCid: sCid });			
			this.$('ul').append(view.render().el);
			this.views[model.cid] = view;
		} else {
			//this.$('ul').html('<li>There are currently no tables with free seats.</li>')
		}
	},
	
	removeItem : function ( model ) {		
		
		var index = this.model.get('shapes').indexOf(model);
		console.log( '[ShapeMoveGuestListView] removeItem', model.cid, index);
		
		if ( index < 0 && this.views[model.cid]) {
			this.views[model.cid].remove(); 
			delete this.views[model.cid];
		}		
	}
	
});

});