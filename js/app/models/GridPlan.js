define(["./Plan", "./Units", "libs/Backbone.Framework"], 

function(Plan, Units) {
    
	var GridPlan = Plan.extend({

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

			var system = units.get('system'),
				w = this.get('shape').get('colWidth') * units.displayFactor(system) * this.get('scaleX'),
				h = this.get('shape').get('rowHeight') * units.displayFactor(system) * this.get('scaleY');

			this.set({ colWidth: w, rowHeight: h });		
		}
	});
	
	return GridPlan;
	
});