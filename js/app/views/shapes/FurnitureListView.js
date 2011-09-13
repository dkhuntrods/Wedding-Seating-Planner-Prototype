$(function(){

FurnitureListView = Backbone.View.extend({

	className: 'shape-list',
	tagName: 'ul',
	
	initialize: function (attrs) {
		
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem' );
		
		this.model.bind('add', this.addItem);
		this.model.bind('remove', this.removeItem);
		this.model.bind('reset', this.reset);
		
		this.factory = attrs.factory;
	},
	
	reset: function () {
		
		$(this.el).empty();
		
		if (this.model.length > 0) {
			this.model.each ( this.addItem, this );
		} 
	},
	
	render : function () {
		
		
		this.reset();
		return this;
	},
	
	addItem : function( model ) {
		
		
		var view = this.factory.create(model);			
		$(this.el).append(view.render().el);
	},
	
	removeItem : function ( model ) {		
		
		//var index = this.model.indexOf(model);
		
		
		/*
		if ( index < 0 && this.views[model.cid]) {
			this.views[model.cid].remove(); 
			delete this.views[model.cid];
		}	
		*/		
	}
	
});

});