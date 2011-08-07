$(function(){

ShapeMenuView = ToggleMenuView.extend({
	
	templateId : "#shape-menu-template",
	
	render : function() {
		console.log('[TableMenuView] render');
		var template = _.template( $(this.templateId).html() );
		
		if( this.model.get('type') != ShapeTypes.init ) {
			
			$(this.el).html( template( {cid: this.model.cid} ));	
			//$('ul', this.el).draggable();
		
		}
		return this;
	}
	
	
});

});