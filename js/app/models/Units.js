InitUnits = {
	initFactor : 25,
	conversion : 3.2808399
}

UnitSystems = {

	imperial: { 
		name: 'imperial',
		abbr: 'ft',
		factor: InitUnits.initFactor
	},
	metric: { 
		name: 'metric',
		abbr: 'm',
		factor: InitUnits.initFactor * InitUnits.conversion
	} 
}

define(["libs/Backbone.Framework"], function() {
    
	var Units = Backbone.Model.extend({
		
		defaults : {		
			system	: UnitSystems.imperial,
			factor : UnitSystems.imperial.factor,
			abbr: UnitSystems.imperial.abbr,
			zoom : 1
		},

		setMetric : function () {
			this.set({ system : UnitSystems.metric, abbr: UnitSystems.metric.abbr });
		},

		setImperial : function () {
			this.set({ system : UnitSystems.imperial, abbr: UnitSystems.imperial.abbr });
		},

		setZoom :function (value) {
			this.set({'zoom': value });
		},

		feetToMetres : function (value) {
			return value * .3048;
		},

		metresToFeet : function (value) {
			return value * 3.2808399;
		},

		displayFactor: function (system) {
			return this.getFactorBySystem(system) * this.get('zoom');
		},

		getFactorBySystem: function (system) {
			switch (system) {
			case UnitSystems.imperial:
				return UnitSystems.imperial.factor;
				break;
			case UnitSystems.metric: 
				return UnitSystems.metric.factor;
				break;
			default:
				return UnitSystems.imperial.factor;
				break; 
			}
		},

		convertDimension: function (dim, system) {
			switch (system) {
			case UnitSystems.imperial:
				return this.metresToFeet(dim);
				break;
			case UnitSystems.metric: 
				return this.feetToMetres(dim);
				break;
			}
		},

		checkConversion: function (width, checkSystem, toSystem) {
			var system = this.get('system');

			if ( system === checkSystem ) {			
				width = this.convertDimension(width, toSystem);

			}
			return width;
		}
		
	});

	return Units;

});