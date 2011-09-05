FurnitureSeatSlotsView = Backbone.View.extend({

	templateId: '#seat-input-template',
	className: 'seatInputs',
	tagName: 'ol',
	currentlyBlurring: false,
	
	events : {
		'blur input'	: 'handleBlur',
		'keypress input' : 'checkSave'
	},
	
	enterEvents: {
		'keypress input' : 'checkSave'
	},
	
	initialize: function(attrs) {
		_.bindAll(this, 'render', 'addInput', 'handleBlur', 'handleError');
		console.log('	', this.model.cid)
		this.templateId = attrs.templateId || this.templateId;		
		this.model.bind('change:type', this.render);
		this.model.bind('change:seatSlots', this.render);
		this.model.bind('error', this.handleError);		
	},

	render: function () {
		console.log('[FurnitureSeatSlotsView] render');
		var slots = this.model.get('seatSlots');
		var typeSlots = this.model.get('type').slots;
		
		//console.log(slots, typeSlots);
		
		$(this.el).empty();
		
		for (var i = 0; i < typeSlots; i++ ) {
			//console.log(slots[i])			
			this.addInput(slots[i] || 0, i);			
		}
		
		this.delegateEvents(this.events);
		return this;
	},
	
	addInput: function (value, index) {
		console.log('addInput');
		var s = !_(value).isUndefined() && value !== '' ? value : 0,
			template = _.template($(this.templateId).html()),
			suffix = parseInt(value) === 1 ? 'seat' : 'seats',
			id = _.uniqueId('slot-'+index+'-');
		
		$(this.el).append( template({ value: s, suffix: suffix, id: id }) );
	},
	
	checkSave: function (event) {
		if (event.which === 13) {
			console.log('checkSave');
			this.handleBlur(event);				
		}
	},
		
	handleBlur : function (event) {
		var value = parseInt(event.target.value);
		//console.log('[FurnitureSeatSlotsView] handleBlur', value, !_.isNaN( parseInt(event.target.value)) );
		event.stopPropagation();
		var index = $(event.target).attr('id').split('-')[1],
			slots = this.model.get('seatSlots').concat();
		
		console.log('[FurnitureSeatSlotsView] handleBlur', this.model.cid, value, index, slots );
		
		if ( !_.isNaN( value ) && slots[index] !== value) {			
			console.log('setting', value);
			slots[index] = value;
			this.model.set({ seatSlots : slots });
			//this.model.trigger('change:seatSlots');
			//console.log(this.model.get('seatSlots'));		
		}
		
	},
	
	handleError: function () {
		this.delegateEvents(this.enterEvents);
		this.render();		
	}

});