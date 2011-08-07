AppView = Backbone.View.extend({
	
	appFrameId: '#app-frame-template',
	toolbarId: '#toolbar-template',
	guestlistState: 'visible',
	
	events: {
		'click .addRandom' : 'addRandom',
		'click .clearShapes' : 'clearShapes',
		'click .toggleGuestLists': 'toggleGuestlists',
	},
	
	initialize: function() {
		_.bindAll(this, 'toggleGuestlists')
		var toolbarTemplate = _.template( $(this.toolbarId).html() );
		var appFrameTemplate = _.template( $(this.appFrameId).html() );
		
		$(this.el).append(toolbarTemplate);
		$(this.el).append(appFrameTemplate);
		
		this.editView = new EditShapeWithGuestsView({ model: this.model.editModel, factory: new EditShapeWithGuestsFactory() });
		
		this.roomContainerView = new RootRoomView({ model: this.model.roomContainer , el: '.layer', factory: new RoomContainerFactory() });		
		
		this.roomDimensionsView = new RoomDimensionsView({ model: this.model.roomContainer.room });
		this.unitsView = new UnitsView({ model: this.model.units });
		
		this.shapeListView = new FurnitureListView({ el: '.layer .shape-list', model: this.model.shapes, factory: new FurnitureListItemFactory() });
		this.guestsSeatedView = new GuestsSeatedView({ model: this.model.guests });
		
		$(this.el).prepend(this.editView.el);
		
	},
	
	render: function () {
		$('.layer').draggable();
		
		this.roomContainerView.render();
		//this.shapeListView.render();
		
		$(this.el).prepend(this.editView.render().el);
		$(this.el).prepend($('.toolbar').append( $(this.roomDimensionsView.render().el).append( this.unitsView.render().el) ));
		$('.toolbar').prepend(this.guestsSeatedView.render().el);
		
	},
	
	addRandom: function () {
		this.model.addRandomShape();
	},
	
	clearShapes: function () {
		this.model.clearShapes();
	},
	
	toggleGuestlists: function (event) {		
		event.preventDefault();
		var show = 'Show Guestlists',
			hide = 'Hide Guestlists',
			className = '.toggleGuestLists',
			el = $(className),
			guestLists = this.$('.shape-list .guest-list-assigned-table'),
			max = 0;
		
		var text = el.html();
		var that = this; 
		console.log(className, text);
		
		switch (this.guestlistState) {
		case 'visible': 
			console.log('hiding');
			guestLists.show();
			guestLists.slideUp('slow', function(guestList) {
				console.log('hiding complete')
				
				el.html(show);
				if ( max++ == 0 ) {
					that.createCSS('hidelist', '.shape-list .guest-list-assigned-table', 'display:none');					
				}
				that.guestlistState = 'hidden';
			});
			break;
		case 'hidden':
			console.log('showing')
			guestLists.slideDown('slow', function() {
				console.log('showing complete')
				el.html(hide);
				that.removeCSS('hidelist');
				that.guestlistState = 'visible';
			});
			break;
		}
				
	},
	
	createCSS: function(id, selector, declaration) {
		// test for IE
		var ua = navigator.userAgent.toLowerCase();
		var isIE = (/msie/.test(ua)) && !(/opera/.test(ua)) && (/win/.test(ua));

		// create the style node for all browsers
		var style_node = document.createElement("style");
		style_node.setAttribute("type", "text/css");
		style_node.setAttribute("media", "screen"); 
		style_node.setAttribute("id", id);
		// append a rule for good browsers
		if (!isIE) style_node.appendChild(document.createTextNode(selector + " {" + declaration + "}"));

		// append the style node
		document.getElementsByTagName("head")[0].appendChild(style_node);

		// use alternative methods for IE
		if (isIE && document.styleSheets && document.styleSheets.length > 0) {
			var last_style_node = document.styleSheets[document.styleSheets.length - 1];
			if (typeof(last_style_node.addRule) == "object") last_style_node.addRule(selector, declaration);
		}
	},
	
	removeCSS: function (id) {
		$('#'+id).remove();
	}
	
	
})