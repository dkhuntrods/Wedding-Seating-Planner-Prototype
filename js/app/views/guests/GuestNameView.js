$(function() {

GuestNameView = Backbone.View.extend({
	
	templateId: '#guest-name-template',
	
	initialize: function(attrs) {
        //console.log('[GuestNameView] initialize');
		
		this.templateId = attrs.templateId || this.templateId;
		
        _.bindAll(this, 'render', 'removeView');		
   		if (this.model) this.setModel(this.model);		
    },
	
	setModel: function(model) {
		this.model = model;
		this.model.bind('change:name', this.render);
		this.model.bind('remove', this.removeView);
	},
		
	render: function() {
        //console.log('[GuestNameView] render', this.model.get('label'));
		var template = _.template($(this.templateId).html());
        this.el = template(this.model.toJSON());
	
        return this;
    },

	removeView : function() {		
		this.remove();		
		this.model.unbind();
	}

});

});