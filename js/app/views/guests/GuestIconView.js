$(function() {

GuestIconView = Backbone.View.extend({
	
	tagName: 'span',
	
	initialize: function(args) {
        

        _.bindAll(this, 'render', 'removeView');		
   		if (this.model) this.setModel(this.model);		
    },
	
	setModel: function(model) {
		this.model = model;
		this.model.bind('change:gender', this.render);
		this.model.bind('change:ageRange', this.render);
		this.model.bind('remove', this.removeView);
	},
		
	render: function() {
		
		this.className = 'i i'+this.model.get('ageRange') + this.model.get('gender');
        

        $(this.el).attr('class', '');
		$(this.el).addClass(this.className);
	
        return this;
    },

	removeView : function() {		
		
		this.remove();		
		this.model.unbind();
	}

});

});