$(function(){

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
		
		//console.log("[ToggleMenuView] initialize");
		this.templateId = attrs.templateId || this.templateId;
		this.toggleable = attrs.toggleable || this.toggleable;
		 
		if (this.model) this.setModel(this.model);	
		
		if (this.toggleable) {		
			this.delegateEvents(this.toggleEvents);
		}	
    },
	
	setModel: function(model) {
		//console.log("[ToggleMenuView] setModel");
		this.model = model;
		this.model.bind('change', this.render);
		this.model.bind('remove', this.removeView);
	},
	
	render : function() {
		//console.log('[ToggleMenuView] render');
		var template =_.template( $(this.templateId).html() ),
			cid = this.model.cid,
			context = _.extend(this.model.toJSON(), { cid: cid });
		
		$(this.el).html( template( context ));	
		this.$('ul').hide();	
		return this;
	},
	
	toggleMenu : function () {
		console.log('toggleMenu');
		this.$('ul').slideToggle('fast');
		$(this).focus();					
	},
	
	enterMenu : function () {
		//console.log('enterMenu');
		if( !_.isUndefined(this.timeout) && !_.isNull(this.timeout) ) clearTimeout(this.timeout);
	},
	
	leaveMenu : function () {
		//console.log('leaveMenu');
		this.timeout = setTimeout( this.hideMenu, 800);
	},
	
	hideMenu : function () {
		//console.log('hideMenu');
		this.$('ul').slideUp('fast');
	},
	
	removeView: function () {
		//console.log('[ToggleMenuView] removeView');
		this.remove();
		this.model.unbind();
	}
	
});

});