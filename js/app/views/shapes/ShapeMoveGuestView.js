ShapeMoveGuestView = Backbone.View.extend({
	
	tagName: 'li',
	template: _.template('<a href="#tables/<%= ptCid %>/seats/<%= psCid %>/guest/move/tables/<%= tCid %>"><%= label %></a>'),
	
	tCid: '',
	sCid: '',
	
	initialize: function (attrs) {
		_.bindAll(this, 'render')
		console.log('[ShapeMoveGuestView] init', this.model);
		this.tCid = attrs.tCid || this.tCid;
		this.sCid = attrs.sCid || this.sCid;
		
		this.model.bind('change', this.render);
	},
	
	render: function () {
		console.log('[ShapeMoveGuestView] render');
		
		if (this.tCid && this.sCid ) {
			$(this.el).html(this.template({ ptCid:this.tCid, psCid:this.sCid, tCid: this.model.cid, label: this.model.get('name')}));
		} else {
			$(this.el).empty();
		}
		
		return this;
	}
	
});