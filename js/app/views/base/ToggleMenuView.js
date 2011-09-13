//$(function(){

ToggleMenuView = Backbone.View.extend({
	
	templateId : '.toggle-menu-template',	
	className : 'menu',
	toggleable : true,
		
	toggleEvents : {			
		'click .menu-toggle' : 'toggleMenu',
		'mouseenter' : 'enterMenu',
		'mouseleave' : 'leaveMenu',
		'blur' : 'leaveMenu'
	},
	
	initialize: function(attrs) {
		_.bindAll(this, 'hideMenu', 'render', 'removeView');
		
		
		this.templateId = attrs.templateId || this.templateId;
		this.toggleable = attrs.toggleable || this.toggleable;
		 
		if (this.model) this.setModel(this.model);	
		
		if (this.toggleable) {		
			this.delegateEvents(this.toggleEvents);
		}	
    },
	
	setModel: function(model) {
		
		this.model = model;
		this.model.bind('change', this.render);
		this.model.bind('remove', this.removeView);
	},
	
	render : function() {
		
		var template =_.template( $(this.templateId).html() ),
			cid = this.model.cid,
			context = _.extend(this.model.toJSON(), { cid: cid });
		
		$(this.el).html( template( context ));	
		this.$('ul').hide();	
		return this;
	},
	
	toggleMenu : function () {
		
		this.$('ul').slideToggle('fast');
		$(this).focus();					
	},
	
	enterMenu : function () {
		
		if( !_.isUndefined(this.timeout) && !_.isNull(this.timeout) ) clearTimeout(this.timeout);
	},
	
	leaveMenu : function () {
		
		this.timeout = setTimeout( this.hideMenu, 800);
	},
	
	hideMenu : function () {
		
		this.$('ul').slideUp('fast');
	},
	
	removeView: function () {
		
		this.remove();
		this.model.unbind();
	}
	
});

//});