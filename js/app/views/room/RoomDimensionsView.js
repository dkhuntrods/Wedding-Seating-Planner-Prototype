define(["libs/Backbone.Framework"], 

function() {
    
	var RoomDimensionsView = Backbone.View.extend({
		
		template : _.template( $("#room-dims-edit-template").html() ),
		className : 'roomDims',

		events : {		

			'keypress #roomWidth' : 'checkSave',
			'keypress #roomHeight' : 'checkSave',
			'blur #roomHeight' : 'saveDims',
			'blur #roomWidth' : 'saveDims',
			'click .metric' : 'setMetric',
			'click .imperial' : 'setImperial'
		},


		initialize: function() {

			_.bindAll(this, 'render', 'update', 'updateWidth', 'updateHeight','removeView', 'saveDims', 'checkSave', 'handleError');	

			if (this.model) this.setModel(this.model);		
	    },

		setModel: function(model) {

			this.model = model;
			this.model.bind('change:width', this.updateWidth);
			this.model.bind('change:height', this.updateHeight);
			this.model.bind('remove', this.removeView);
			this.model.bind('error', this.handleError);
			this.model.get('units').bind('change', this.update);
		},

		render: function () {

			$(this.el).html( this.template( this.model.attributes ) );

			return this;
		},

		updateWidth: function () {

			var width = this.model.get('units').checkConversion(this.model.get('width'), UnitSystems.metric, UnitSystems.metric);			
			width = Math.formatDecimals(width, 2);
			this.$('#roomWidth').attr("value", width);
		},

		updateHeight: function () {

			var height = this.model.get('units').checkConversion(this.model.get('height'), UnitSystems.metric, UnitSystems.metric);	
			height = Math.formatDecimals(height, 2);				
			this.$('#roomHeight').attr("value", height);
		},

		updateAbbr: function () {
			this.$('span').html(this.model.get('units').get('abbr'));
		},

		checkSave: function (event) {
			if (event.which === 13) {
				this.saveDims();
			}
		},

		saveDims: function () {

			var m = this.model.toJSON(),
				width = this.getWidth(),
				height = this.getHeight(),
				newScale, editDim, maxDim;

			if (!isNaN(width) && !isNaN(height)) {	

				this.model.set({ width: width, height: height });
				//this.model.save({ width: width, height: height });			

			} else {
				this.update();
			}

		},

		update: function () {
			this.updateWidth();
			this.updateHeight();
			this.updateAbbr();
		},

		getWidth: function () {
			return this.model.get('units').checkConversion(parseFloat(this.$('#roomWidth').attr("value")), UnitSystems.metric, UnitSystems.imperial);
		},

		getHeight: function () {
			return this.model.get('units').checkConversion(parseFloat(this.$('#roomHeight').attr("value")), UnitSystems.metric, UnitSystems.imperial);
		},


		removeView: function () {

			this.remove();
			this.model.unbind();
		},

		handleError: function (model, error) {
			
			this.updateWidth();
			this.updateHeight();
		},

		setMetric: function (event) {
			
			this.model.get('units').setMetric();
			
			//input = $(event.target);
			//input.attr('checked', 'checked');
			//input.click();
		},

		setImperial: function (event) {
			
			this.model.get('units').setImperial();
			
			//input = $(event.target);
			//input.attr('checked', 'checked');
			//input.click();
		}
		
	});
	
	return RoomDimensionsView;
	
});