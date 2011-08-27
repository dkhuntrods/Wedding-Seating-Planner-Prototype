GridPlan = Plan.extend({
	
	defaults: _({ 	
		colWidth : UnitSystems.imperial.factor,
		rowHeight : UnitSystems.imperial.factor
	}).extend(Plan.prototype.defaults),
	
	initialize: function (attrs) {
		_.bindAll(this, 'handleUnitsChanged');
		Plan.prototype.initialize.call(this, attrs);
		
		this.get('shape').get('units').bind('change', this.handleUnitsChanged);
	},
	
	handleUnitsChanged: function(units) {
		console.log('handleUnitsChanged', units.get('system').name)
		var system = units.get('system'),
			w = this.get('shape').get('colWidth') * units.displayFactor(system) * this.get('scaleX'),
			h = this.get('shape').get('rowHeight') * units.displayFactor(system) * this.get('scaleY');
		console.log(w)
		this.set({ colWidth: w, rowHeight: h });		
	}
});