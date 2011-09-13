//$(function(){

EditShapeWithGuestsView = Backbone.View.extend({
	
	className: 'edit-shape-guests',
	
	events: {
		'drop .edit-shape .shape': 'handleShapeDrop',
		'drop .guest-list': 'handleGuestListDrop',
		'change .shape-list': 'setSelection',
		'mouseup .shape canvas': 'mouseUp',
		'click .move-cancel': 'clearMoveUI'
	},
	
	mouseUp: function (event) {
		
		if (event.offsetX && event.offsetY) {
		
			var model = this.editView.shapeView.model,
			shape = model.get('shape'),
			units = shape.get('units'),
			x = event.offsetX - model.get('footprintWidth') * 0.5,
			y = event.offsetY - model.get('footprintHeight') * 0.5;
			we = 
			shape.set({ x:x, y:y });
		}
	},
	
	initialize: function(attrs) {
		_.bindAll(this, 'render', 'handleShapeDrop', 'handleGuestListDrop', 'handleStateChange', 'clearMoveUI');
		
		var views = attrs.factory.create(this.model);
		this.editView = views.editView;	
		this.guestView = views.guestView;
		this.moveGuestView = views.moveGuestView;
		this.exitView = views.exitView;
		
		this.model.bind('change:state', this.handleStateChange);
		this.handleStateChange();
		//this.$('.shape-list-move-table').hide();
		
	},
	
	render: function() {		
		$(this.el).append( this.exitView.render().el );
		$(this.el).append( this.editView.render().el );
		$(this.el).append( this.guestView.render().el );
		$(this.el).append( this.moveGuestView.render().el );	
		return this;		
	},
	
	handleStateChange: function() {
		$(this.el).attr('class', this.className + ' ' + this.model.get('state'));
		
		if (_(this.model.get('state').split(' ')).indexOf('move-guest') > 0) {
			this.$('.shape-list-move-guest').show();
		} else {
			this.$('.shape-list-move-guest').hide();
		}
	},
	
	handleShapeDrop: function (event, ui) {
		
		
	
		var data = $(ui.draggable).data(),
			model = this.editView.shapeView.model,
			shape = model.get('shape'),
			units = shape.get('units'),
			canvas = $(event.target).find('canvas'),
			ox = canvas.offset().left,
			oy = canvas.offset().top,
			px = ui.position.left,
			py = ui.position.top,
			x0 = px - ox - model.get('footprintWidth') * 0.5,
			y0 = py - oy - model.get('footprintHeight') * 0.5,
			x1 = x0 / units.displayFactor(UnitSystems.imperial) * model.get('scaleX'),
			y1 = y0 / units.displayFactor(UnitSystems.imperial) * model.get('scaleY'),
			
			tCid = shape.cid,
			gCid = data.gCid,
			ptCid = data.tCid,
			psCid = data.sCid,
			
			hitseat = shape.checkClosest(x1, y1) || shape.getFirstEmptySeat(),
			sCid, route, guest, previousGuest;		
		
		if (hitseat) {
			
			sCid = hitseat.cid;
			
			/*
			'guests/:gCid/remove/tables/:tCid/seats/:sCid/guest/add': 'moveGuestToTable',
			'tables/:tCid/seats/:sCid/guest/remove': 'removeGuestFromTable',
			'tables/:ptCid/seats/:psCid/guest/remove/tables/:tCid/seats/:sCid/guest/add' : 'transferGuestBetweenSeats'
			*/
			
			if (ptCid && psCid) {
				route = 'tables/'+ ptCid +'/seats/' + psCid + '/guest/remove/tables/'+ tCid +'/seats/'+ sCid +'/guest/add';
				this.model.transferGuestBetweenSeatsByCid(ptCid, psCid, tCid, sCid);
			} else if (gCid) {
				route = 'guests/' + gCid + '/remove/tables/'+ tCid +'/seats/'+ sCid +'/guest/add';
				this.model.moveGuestToShapeByCid(gCid, tCid, sCid);
			}
			
			
			//Backbone.history.navigate(route, true);
			
		}
		
	},
	
	handleGuestListDrop: function (event, ui) {
		
		var data = $(ui.draggable).data(),
		gCid = data.gCid,
		ptCid = data.tCid,
		psCid = data.sCid;
		
		if (ptCid && psCid) {
			this.model.removeGuestFromShapeByCid(ptCid, psCid)
		}
	},
	
	setSelection: function (event) {
		
	},
	
	clearMoveUI: function () {
		this.model.set({ state: 'active' });
	}
});

//});