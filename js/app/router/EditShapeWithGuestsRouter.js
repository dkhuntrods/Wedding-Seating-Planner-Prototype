EditShapeWithGuestsRouter = Backbone.Router.extend({
	
	routes : {
		'/' : 'initialize',
		'tables/edit/open' : 'editShapeOpen',
		'tables/:Cid/edit/open' : 'editShapeOpen',
		
		'tables/edit/exit' : 'editShapeExit',
		'tables/edit/exit/save' : 'editShapeExitSave',
		'tables/edit/clear' : 'editShapeClear',
		
		'tables/:tCid/seats/:sCid/guest/remove': 'removeGuestFromShape',
		'tables/:tCid/seats/:sCid/guest/move': 'moveGuestFromShape',
		'tables/:ptCid/seats/:psCid/guest/move/tables/:tCid' : 'transferGuestToShape'
	},
	
	initialize : function( params ) {
		console.log('[EditShapeWithGuestsRouter] initialize');
	
		_.bindAll(this, 'editShapeOpen', 'editShapeExit', 'editShapeExitSave');
		this.model = params.model;
		
		this.model.set({'state':'inactive'});	
		
	},
	
	editShapeOpen : function (cid) {
		console.log('[EditShapeWithGuestsRouter] editShapeOpen', cid);
		if (this.model) {
			this.model.set({'eid' : cid});		
			this.model.setShape();			
			this.model.set({'state':'active'});
		}
		
		this.navigate('', true);
	},
			
	editShapeExit: function (cid) {
		console.log('[EditShapeWithGuestsRouter] editShapeExit');
		if (this.model) {
			this.model.exitShape();		
			this.model.set({'state':'inactive'});
		}	
		this.navigate('', true);
	},
	
	editShapeExitSave: function () {
		console.log('[EditShapeWithGuestsRouter] editShapeExitSave');
		if (this.model) {
			this.model.saveShape();		
			this.model.set({'state':'inactive'});	
		}
		this.navigate('', true);
	},
	
	removeGuestFromShape: function (tCid, sCid) {
		if (this.model) {
			this.model.removeGuestFromShapeByCid(tCid, sCid);	
		}
		this.navigate('', true);
	},
	
	moveGuestFromShape: function (tCid, sCid) {
		if (this.model) {
			this.model.moveGuestFromShapeByCid(tCid, sCid);	
		}
		this.navigate('', true);
	},
	
	editShapeClear: function () {
		console.log('[EditShapeWithGuestsRouter] editShapeClear');
		if (this.model) {
			this.model.removeGuestsFromShape();			
		}	
		this.navigate('', true);
	},
	
	transferGuestToShape: function (ptCid, psCid, tCid) {
		console.log('[EditShapeWithGuestsRouter] transferGuestBetweenSeats', ptCid, psCid, tCid);
		if (this.model) {			
			this.model.transferGuestToShape(ptCid, psCid, tCid);			
		}
		this.navigate('', true);
	}
	
});