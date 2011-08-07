ShapeOptionView = Backbone.View.extend({
	
	className: 'shape-select',
	tagName: 'option',
	template: _.template('<option value="<%= value %>"><%= label %></option>'),
	
	events: {
		'change': 'setSelection'
	},
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'setSelection')
		console.log('[ShapeSelectView] init', this.model);
		this.model.bind('add', this.addItem);
	},
	
	render: function () {
		console.log('[ShapeOptionView] render');
		this.el = this.template({ value: this.model.cid, label: this.model.get('name')});
		this.delegateEvents(this.events);
		return this;
	},
	
	setSelection: function (event) {
		console.log(event);
	}
	
});