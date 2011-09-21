define(["libs/Backbone.Framework"], 

function() {
    
	var ShapeMoveGuestView = Backbone.View.extend({
		
		tagName: 'li',
		template: _.template('<a href="#tables/<%= ptCid %>/seats/<%= psCid %>/guest/move/tables/<%= tCid %>"><%= label %></a>'),

		tCid: '',
		sCid: '',

		initialize: function (attrs) {
			_.bindAll(this, 'render')

			this.tCid = attrs.tCid || this.tCid;
			this.sCid = attrs.sCid || this.sCid;

			this.model.bind('change', this.render);
		},

		render: function () {

			if (this.tCid && this.sCid ) {
				$(this.el).html(this.template({ ptCid:this.tCid, psCid:this.sCid, tCid: this.model.cid, label: this.model.get('name')}));
			} else {
				$(this.el).empty();
			}

			return this;
		}
		
	});
	
	return ShapeMoveGuestView;
	
});