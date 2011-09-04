$(function(){

ShapeEditDimensionsView = Backbone.View.extend({
	
	templateId : "#shape-edit-dimensions-template",
	className : 'menu dimensions',
	
	events : {		
		
		'keypress #width' : 'checkSave',
		'keypress #height' : 'checkSave',
		'blur #height' : 'saveDims',
		'blur #width' : 'saveDims',
		'mouseup .open-dims' : 'toggleDims',
		'mouseup .cancel' : 'toggleDims',
		'mouseup .save' : 'saveExit',
		'click .menu-toggle' : 'toggleDims',
		'mouseenter' : 'enterMenu',
		'mouseleave' : 'leaveMenu',
		'blur' : 'leaveMenu'
	},
	
	
	initialize: function(attrs) {
	    //console.log("[ShapeEditDimensionsView] initialise");
		_.bindAll(this, 'render', 'update', 'updateWidth', 'updateHeight','removeView', 'saveExit', 'saveDims', 'checkSave', 'handleError', 'hideMenu');	
		
		this.templateId = attrs.templateId || this.templateId;
		
		this.model.bind('change:width', this.updateWidth);
		this.model.bind('change:height', this.updateHeight);
		this.model.bind('change:type', this.render);
		this.model.bind('remove', this.removeView);
		this.model.bind('error', this.handleError);
		this.model.get('units').bind('change', this.update);	
    },
	
	
	render: function () {
		//console.log("[ShapeEditDimensionsView] render");
		var template = _.template( $(this.templateId).html() );
		
		if( this.model.get('type').id != SHAPE_INIT_ID ) {
			$(this.el).html( template( this.model.attributes) );
		} else {
			$(this.el).empty();
		}
		
		this.$('.dims').hide();
		return this;
	},
	
	toggleDims: function () {
		console.log('[ShapeEditDimensionsView] toggleDims', this.model);
		console.log(this);
		$(this.el).find('.dims').slideToggle('fast');
		$(this).focus();
	},
	
	updateWidth: function () {
		console.log('[ShapeEditDimensionsView] updateWidth', this.model);
		var width = this.model.get('units').checkConversion(this.model.get('width'), UnitSystems.metric, UnitSystems.metric);
		width = Math.formatDecimals(width, 2);		
		this.$('#width').attr("value", width);
	},
	
	updateHeight: function () {
		console.log('[ShapeEditDimensionsView] updateHeight', this.model);		
		var height = this.model.get('units').checkConversion(this.model.get('height'), UnitSystems.metric, UnitSystems.metric);	
		height = Math.formatDecimals(height, 2);	
		this.$('#height').attr("value", height);
	},
	
	updateAbbr: function () {
		this.$('span').html(this.model.get('units').get('abbr'));
	},
	
	checkSave: function (event) {
		if (event.which === 13) {
			this.saveDims();
		}
	},
	
	saveDims: function () {
		
		var m = this.model.toJSON(),
			width = this.getWidth(),
			height = this.getHeight(),
			newScale, editDim, maxDim;
			
		console.log('[ShapeEditDimensionsView] updateDims', width, height)
		
		if (!isNaN(width) && !isNaN(height)) {	
			
			this.model.set({ width: width, height: height });
			width = this.getWidth();
			height = this.getHeight();
			
			maxDim = width > height ? width : height,
			//maxDim *= 25;
			editDim = m.footprintWidth > m.footprintHeight ? m.footprintWidth : m.footprintHeight,
			defaultDim = maxDim + this.model.get('buffer') * 2;			
			newScale = editDim / defaultDim;
			
			//console.log(editDim, defaultDim, newScale, this.model.get('scaleX'));			
			if (newScale != 1 ) this.model.set({ scaleX: newScale, scaleY: newScale });
			//console.log(editDim, defaultDim, newScale, this.model.get('scaleX'));
			
		} else {
			this.updateWidth();
			this.updateHeight();
		}
	
	},
	
	update: function () {
		this.updateWidth();
		this.updateHeight();
		this.updateAbbr();
	},
	
	getWidth: function () {	
		return this.model.get('units').checkConversion(parseFloat(this.$('#width').attr("value")), UnitSystems.metric, UnitSystems.imperial);
	},
	
	getHeight: function () {
		return this.model.get('units').checkConversion(parseFloat(this.$('#height').attr("value")), UnitSystems.metric, UnitSystems.imperial);
	},
	
	saveExit: function () {
		this.saveDims();
		this.toggleDims();
	},
	
	removeView: function () {
		console.log("[ShapeEditDimensionsView] removeView");
		this.remove();
		this.model.unbind();
	},
	
	handleError: function (model, error) {
		alert(error);
		this.updateWidth();
		this.updateHeight();
		console.log(model.get('seatSlots'));
	},
	
	enterMenu : function () {
		if( !_.isUndefined(this.timeout) && !_.isNull(this.timeout) ) clearTimeout(this.timeout);
	},
	
	leaveMenu : function () {
		this.timeout = setTimeout( this.hideMenu, 1000);
	},
	
	hideMenu : function () {
		$(this.el).find('.dims').slideUp('fast');
	}

});

});