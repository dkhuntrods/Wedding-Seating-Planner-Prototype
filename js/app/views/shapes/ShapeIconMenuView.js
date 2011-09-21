define(["libs/Backbone.Framework"], 

function() {
    
	var ShapeIconMenuView = Backbone.View.extend({
		
		templateId: "#shape-icon-menu-template",
		className: 'shape-icon-menu', 

		initialize: function (attrs) {

			_.bindAll(this, 'render');

			this.templateId = attrs.templateId || this.templateId;	

		},

		render : function () {

			var context = _.extend(this.model.toJSON(), { cid: this.model.cid}),
				template = _.template( $(this.templateId).html() );

			if( this.model.get('type').id != SHAPE_INIT_ID ) {

				$(this.el).html( template( context ));

			} else {
				$(this.el).empty();
			}

			return this;
		}
		
	});
	
	return ShapeIconMenuView;
	
});