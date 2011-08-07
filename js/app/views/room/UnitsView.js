$(function(){
	
UnitsView = Backbone.View.extend({
	
	template : _.template( $("#units-edit-template").html() ),
	className : 'editUnits',
	
	events: {
		'click .metric' : 'setMetric',
		'click .imperial' : 'setImperial'
	},
	
	initialize: function () {
		console.log('[UnitsView] initialize')
		_.bindAll(this, 'render');
		this.model.bind('change:system', this.render);
	},
	
	render: function() {
		console.log('[UnitsView] render')
		var unitName = this.model.get('system').name === UnitSystems.metric.name ? UnitSystems.imperial.name : UnitSystems.metric.name;
		//console.log('unitName:', unitName, this.model.get('system').name);
		$(this.el).html( this.template( { unitName: unitName } ) );
		return this;
	},
		
	setMetric: function () {
		console.log('setMetric');
		this.model.setMetric();
	},
	
	setImperial: function () {
		this.model.setImperial();
	}
	
	
});
	
	
});