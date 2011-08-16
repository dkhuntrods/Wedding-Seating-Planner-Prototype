ExitEditTableView = Backbone.View.extend({
	
	className: 'saveExit',
	templateId: "#exit-edit-table-template",
	//template: _.template( $("#exit-edit-table-template").html() ),
	
	initialize: function () {
		console.log( '[ExitEditTableView]' );
		_.bindAll( this, 'render' );
		this.model.bind( 'change:eid', this.render );		
		this.template = _.template( $(this.templateId).html() );
	},
	
	render: function () {
		
		console.log('[ExitEditTableView] render', this.model.toJSON());
		var context = this.model.toJSON();
		if ( typeof context.eid === 'undefined') context.eid = 'new';
		$(this.el).html( this.template( context ));
		
		return this;
	}
	
});