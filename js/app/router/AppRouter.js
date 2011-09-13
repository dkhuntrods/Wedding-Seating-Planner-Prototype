AppRouter = Backbone.Router.extend({
	
	initialize : function (params) {
		
        _.bindAll(this, 'removeByID', 'duplicate', 'clear');
		
		this.model = params.model;
        this.view = params.view;
		
	},
	
	routes : {
		'tables/clear' : 'clear',
        'tables/:Cid/remove' : 'removeByID',
		'tables/:Cid/duplicate' : 'duplicate'
    },

	clear : function () {
				
		if (this.model) {
			this.model.clearShapes();	
		}	
		this.navigate('', true);
	},
	
	removeByID: function (id) {		
		
		if (this.model) {
			this.model.removeShapeByID(id);
		}
		this.navigate('', true);
	},
	
	duplicate : function (cid) {
		
		if (this.model) {
			this.model.duplicateShapeByID(cid);					
		}
		this.navigate('', true);
	}
	
});