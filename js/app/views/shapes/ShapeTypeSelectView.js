ShapeTypeSelectView = Backbone.View.extend({
	
	templateId: '#shape-type-select',
	className: 'shapeSelection',
	
	events: {
		'change' : 'setType'
	},
	
	initialize: function(attrs) {
		_.bindAll(this, 'setType', 'setSelected', 'handleTypeChange');
		this.templateId = attrs.templateId || this.templateId;		
		this.model.bind('change:type', this.handleTypeChange);
		this.handleTypeChange();
	},
	
	render: function () {
		var template = _.template( $(this.templateId).html() );

		$(this.el).html( template() );
		this.setSelected();		
		
		return this;
	},
	
	setType: function (event) {
		//console.log(event);
		var type = this.model.getTypeById(parseInt(event.target.value));
		console.log(event.target.value, type);
		
		
		//this.model.trigger('change:seatSlots');
		this.model.set({ type: type });
		this.model.resetSlots();
		//this.model.set({ type: type });
	},
	
	handleTypeChange: function () {
		this.setSelected();
	},
	
	setSelected: function () {
		console.log('[ShapeTypeSelectView] setSelected', this.model.get('type').id)
		var selId = this.model.get('type').id;
		console.log('setSelected', selId);
		this.$('option').removeAttr('selected');		
		this.$('option[value="'+selId+'"]').attr('selected', 'selected');		
		
	}
	
	
});