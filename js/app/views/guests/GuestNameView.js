$(function() {

GuestNameView = Backbone.View.extend({
	
	templateId: '#guest-name-template',
	
	initialize: function(attrs) {
        
		
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