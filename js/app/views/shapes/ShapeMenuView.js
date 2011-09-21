define(["app/views/base/ToggleMenuView", "libs/Backbone.Framework"], 

function(ToggleMenuView) {
    
	var ShapeMenuView = ToggleMenuView.extend({

		templateId : "#shape-menu-template",

		render : function() {

			var template = _.template( $(this.templateId).html() );

			if( this.model.get('type') != ShapeTypes.init ) {

				$(this.el).html( template( {cid: this.model.cid} ));

			}
			return this;
		}


	});
	
	return ShapeMenuView;
	
});