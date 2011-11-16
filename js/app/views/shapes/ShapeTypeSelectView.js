define(["libs/Backbone.Framework"], 

function() {
    
	var ShapeTypeSelectView = Backbone.View.extend({
		
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

			var type = this.model.getTypeById(parseInt(event.target.value)),
				width, height, margin;

			this.model.set({ type: type });
			
			
			if (type == FurnitureShapeTypes.top) {
				width = 20, height = 3, margin = 0;				
			} else {
				width = this.model.defaults.width, height = this.model.defaults.height;	
			}
			
			this.model.setSizeAtScale(width, height);
			
			this.model.resetSlots();
		},

		handleTypeChange: function () {
			this.setSelected();
		},

		setSelected: function () {

			var selId = this.model.get('type').id;

			this.$('option').removeAttr('selected');		
			this.$('option[value="'+selId+'"]').attr('selected', 'selected');		

		}
		
	});
	
	return ShapeTypeSelectView;
	
});