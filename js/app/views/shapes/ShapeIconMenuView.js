$(function(){

ShapeIconMenuView = Backbone.View.extend({
	
	templateId: "#shape-icon-menu-template",
	className: 'shape-icon-menu', 
	
	initialize: function (attrs) {
		console.log('[ShapeIconMenuView]');
		_.bindAll(this, 'render');
		console.log('this.templateId', this.templateId);
		this.templateId = attrs.templateId || this.templateId;	
		console.log('this.templateId', this.templateId);
	},
	
	render : function () {
		console.log('[ShapeIconMenuView] render');
		
		var context = _.extend(this.model.toJSON(), { cid: this.model.cid}),
			template = _.template( $(this.templateId).html() );
		
		if( this.model.get('type').id != SHAPE_INIT_ID ) {
			
			$(this.el).html( template( context ));
			//$('ul', this.el).draggable();
		
		} else {
			$(this.el).empty();
		}
		
		return this;
	}
	
	
});

});