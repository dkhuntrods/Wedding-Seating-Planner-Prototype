$(function(){

ShapeTitleView = Backbone.View.extend({
	
	templateId : '#shape-title-template',
	className : 'title',
	
	events : {		
		'blur .edit' : 'closeEditName',
		'keypress .edit' : 'checkSave',
		'mouseenter .label' : 'enterName',
		'mouseenter .edit' : 'enterEdit',
		'mouseleave .edit' : 'leaveEdit',
		'mouseleave .label' : 'leaveName'
	},
	
	initialize: function(attrs) {
	    //console.log("[ShapeTitleView] initialise");
		_.bindAll(this, 'render', 'updateName', 'closeEditName', 'openEditName', 'removeView');	
		
		this.model.bind('change:name', this.updateName);
		this.model.bind('change:type', this.render);
		this.model.bind('remove', this.removeView);	
		this.templateId = attrs.templateId || this.templateId;
    },
	
	render: function () {
		//console.log("[ShapeTitleView] render");
		var template = _.template( $(this.templateId).html() );
		
		if( this.model.get('type').id != SHAPE_INIT_ID ) {
			$(this.el).html( template( this.model.toJSON()) );
		} else {
			$(this.el).empty();
		}
		
		return this;
	},
		
	updateName: function () {
		var name = this.model.get('name');
		this.$('.label').text(name);
		this.$('.edit').attr("value", name);
	},
	
	openEditName: function () {
		//console.log("[TableView] openEditName");
		
		$(this.el).addClass("editable");
		this.$('.edit').attr('value', this.model.get("name")).focus();		
	},
	
	enterEdit: function () {
		//console.log("[TableView] enterEdit");
		if( !_.isUndefined(this.leaveTimeout) && !_.isNull(this.leaveTimeout) ) clearTimeout(this.leaveTimeout);
	},
	
	enterName: function () {
		//console.log("[TableView] enterName");
		if( !_.isUndefined(this.leaveTimeout) && !_.isNull(this.leaveTimeout) ) clearTimeout(this.leaveTimeout);
		this.enterTimeout = setTimeout( this.openEditName, 500);
	},
	
	leaveEdit: function () {
		//console.log("[TableView] leaveEdit");
		if( !_.isUndefined(this.enterTimeout) && !_.isNull(this.enterTimeout) )  clearTimeout(this.enterTimeout)
		this.leaveTimeout = setTimeout( this.closeEditName, 800);
	},
	
	leaveName: function () {
		//console.log("[TableView] leaveName");
		if( !_.isUndefined(this.enterTimeout) && !_.isNull(this.enterTimeout) )  clearTimeout(this.enterTimeout)
	},
	
	closeEditName: function () {
		//console.log("[TableView] closeEditName");
		
		$(this.el).removeClass("editable");
		this.storeNewName();
	},
	
	checkSave: function (event) {
		if (event.which === 13) {
			this.storeNewName();
			this.$('.edit').blur();
		}
	},
	
	storeNewName: function () {
		this.model.set({ name : this.$('.edit').attr("value") });
	},
	
	removeView: function () {
		console.log("[ShapeTitleView] removeView");
		this.remove();
		this.model.unbind();
	}

});

});