define(["libs/Backbone.Framework"], 

function() {
    
	var ShapeTitleView = Backbone.View.extend({
		
		templateId : '#shape-title-template',
		className : 'title',

		events : {		
			'blur .edit' : 'closeEditName',
			'keypress .edit' : 'checkSave',
			'mouseenter .label' : 'enterName',
			'mouseenter .edit' : 'enterEdit',
			'mouseleave .edit' : 'leaveEdit',
			'mouseleave .label' : 'leaveName'
		},

		initialize: function(attrs) {

			_.bindAll(this, 'render', 'updateName', 'closeEditName', 'openEditName', 'removeView');	

			this.model.bind('change:name', this.updateName);
			this.model.bind('change:type', this.render);
			this.model.bind('remove', this.removeView);	
			this.templateId = attrs.templateId || this.templateId;
	    },

		render: function () {

			var template = _.template( $(this.templateId).html() );

			if( this.model.get('type').id != SHAPE_INIT_ID ) {
				$(this.el).html( template( this.model.toJSON()) );
			} else {
				$(this.el).empty();
			}

			return this;
		},

		updateName: function () {
			var name = this.model.get('name');
			this.$('.label').text(name);
			this.$('.edit').attr("value", name);
		},

		openEditName: function () {

			$(this.el).addClass("editable");
			this.$('.edit').attr('value', this.model.get("name")).focus();		
		},

		enterEdit: function () {

			if( !_.isUndefined(this.leaveTimeout) && !_.isNull(this.leaveTimeout) ) clearTimeout(this.leaveTimeout);
		},

		enterName: function () {

			if( !_.isUndefined(this.leaveTimeout) && !_.isNull(this.leaveTimeout) ) clearTimeout(this.leaveTimeout);
			this.enterTimeout = setTimeout( this.openEditName, 500);
		},

		leaveEdit: function () {

			if( !_.isUndefined(this.enterTimeout) && !_.isNull(this.enterTimeout) )  clearTimeout(this.enterTimeout)
			this.leaveTimeout = setTimeout( this.closeEditName, 1500);
		},

		leaveName: function () {

			if( !_.isUndefined(this.enterTimeout) && !_.isNull(this.enterTimeout) )  clearTimeout(this.enterTimeout)
		},

		closeEditName: function () {

			$(this.el).removeClass("editable");
			this.storeNewName();
		},

		checkSave: function (event) {
			if (event.which === 13) {
				this.storeNewName();
				this.$('.edit').blur();
			}
		},

		storeNewName: function () {
		    this.model.set({ name: this.$('.edit').attr("value") });
		    if (!this.model.isNew()) this.model.save();
		},

		removeView: function () {

			this.remove();
			this.model.unbind();
		}
		
	});
	
	return ShapeTitleView;
	
});