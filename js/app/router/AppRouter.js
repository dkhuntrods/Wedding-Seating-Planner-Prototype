AppRouter = Backbone.Router.extend({
	
	initialize : function (params) {
		
        _.bindAll(this, 'add', 'removeByID', 'duplicate', 'clear');
		
		this.model = params.model;
        this.view = params.view;
		
	},
	
	routes : {
        'tables/add' : 'add',
		'tables/clear' : 'clear',
        'tables/:Cid/remove' : 'removeByID',
		'tables/:Cid/duplicate' : 'duplicate'
    },

	add : function () {
		this.model.addRandomTable();		
		this.navigate('', true); 
	},
	
	clear : function () {
		console.log('[SeatingPlannerAppController] clear', this.model.tables.length);		
		this.model.clearShapes();		
		this.navigate('', true);
	},
	
	removeByID: function (id) {		
		console.log('[SeatingPlannerAppController] removeByID', id);
		this.model.removeShapeByID(id);
		this.navigate('', true);
	},
	
	duplicate : function (cid) {
		console.log('[SeatingPlannerAppController] duplicate', cid, this.model);
		this.model.duplicateShapeByID(cid);					
		this.navigate('', true);
	}
	
});