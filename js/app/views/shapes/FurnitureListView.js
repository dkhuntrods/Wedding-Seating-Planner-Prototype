define(["libs/Backbone.Framework"], 

function() {
    
	var FurnitureListView = Backbone.View.extend({
		
		className: 'shape-list',
		tagName: 'ul',

		initialize: function (attrs) {

			_.bindAll(this, 'render', 'reset', 'addItem');

			this.model.bind('add', this.addItem);
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
		}
		
	});
	
	return FurnitureListView;
	
});