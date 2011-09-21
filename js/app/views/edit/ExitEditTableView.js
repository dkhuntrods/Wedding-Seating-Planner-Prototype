define(["libs/Backbone.Framework"], 

function() {
    
	var ExitEditTableView = Backbone.View.extend({
		
		className: 'saveExit',
		templateId: "#exit-edit-table-template",
		
		initialize: function () {

			_.bindAll( this, 'render' );
			this.model.bind( 'change:eid', this.render );		
			this.template = _.template( $(this.templateId).html() );
		},

		render: function () {

			var context = this.model.toJSON();
			if ( typeof context.eid === 'undefined') context.eid = 'new';
			$(this.el).html( this.template( context ));

			return this;
		}
		
	});
	
	return ExitEditTableView;
	
});