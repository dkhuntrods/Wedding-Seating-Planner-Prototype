ShapeOptionView = Backbone.View.extend({
	
	className: 'shape-select',
	tagName: 'option',
	template: _.template('<option value="<%= value %>"><%= label %></option>'),
	
	events: {
		'change': 'setSelection'
	},
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'setSelection')
		
		this.model.bind('add', this.addItem);
	},
	
	render: function () {
		
		this.el = this.template({ value: this.model.cid, label: this.model.get('name')});
		this.delegateEvents(this.events);
		return this;
	},
	
	setSelection: function (event) {
		
	}
	
});