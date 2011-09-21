define(["libs/Backbone.Framework"], 

function() {
    
	var Plan = Backbone.Model.extend({

		defaults: {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			footprintWidth: 0,
			footprintHeight: 0,
			scaleMode: ScaleMode.NONE,
			scaleFitSize: 0,
			shape: null
		},

		initialize: function (attrs) {
			_.bindAll(this, 'setDimensions','setWidth', 'setHeight', 'setX', 'setY');

			var shape = attrs.shape;

			shape.bind('change:x', this.setX);
			shape.bind('change:y', this.setY);

			shape.bind('change:width', this.setDimensions);
			shape.bind('change:height', this.setDimensions);
			shape.bind('change:scaleX', this.setDimensions);
			shape.bind('change:scaleY', this.setDimensions);

			this.set({ shape: shape });

			this.setDimensions();

		},

		setWidth: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				width = shape.get('width') * units.displayFactor(UnitSystems.imperial),
				oWidth = this.get('width');

			if ( width != oWidth) {

				this.set({ width: width });
			}
		},

		setHeight: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				height = shape.get('height') * units.displayFactor(UnitSystems.imperial),
				oHeight = this.get('height');

			if ( height != oHeight) {

				this.set({ height: height });
			}

		},

		setX: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				x = shape.get('x') * units.displayFactor(UnitSystems.imperial),
				oX = this.get('x');

			if ( x != oX) {

				this.set({ x: x });
			}
		},

		setY: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				y = shape.get('y') * units.displayFactor(UnitSystems.imperial),
				oY = this.get('y');

			if ( y != oY) {

				this.set({ y: y });
			}		
		},

		calculateFootprint: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				footprintWidth = Math.round(shape.get('footprintWidth') * units.displayFactor(UnitSystems.imperial)),
				oFootprintWidth = this.get('footprintWidth'),
				footprintHeight = Math.round(shape.get('footprintHeight') * units.displayFactor(UnitSystems.imperial)),
				oFootprintHeight = this.get('footprintHeight');



			if ( footprintWidth != oFootprintWidth) {

				this.set({ footprintWidth: footprintWidth });
			}
			if ( footprintHeight != oFootprintHeight) {

				this.set({ footprintHeight: footprintHeight });
			}
		},

		setFootprintHeight: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				footprintHeight = Math.round(shape.get('footprintHeight') * units.displayFactor(UnitSystems.imperial)),
				oFootprintHeight = this.get('footprintHeight');

			if ( footprintHeight != oFootprintHeight) {

				this.set({ footprintHeight: footprintHeight });
			}
		},

		setScaleX: function () {
			var shape = this.get('shape'),
				units = shape.get('units'),
				scaleX = shape.get('scaleX'),
				oscaleX = this.get('scaleX');

			if ( scaleX != oscaleX) {

				this.set({ scaleX: scaleX });
			}
		},

		setScaleY: function () {
			var shape = this.get('shape'),
				units = shape.get('units'),
				scaleY = shape.get('scaleY'),
				oscaleY = this.get('scaleY');

			if ( scaleY != oscaleY) {

				this.set({ scaleY: scaleY });
			}
		},

		setScaleFitMode: function () {

			var shape = this.get('shape'),
				units = shape.get('units'),
				footprintHeight = Math.round(shape.get('footprintHeight') * units.displayFactor(UnitSystems.imperial)),	
				footprintWidth = Math.round(shape.get('footprintWidth') * units.displayFactor(UnitSystems.imperial)),
				maxDim = Math.max(footprintWidth, footprintHeight),			
				fitSize = (this.get('scaleFitSize'));


			if ( (maxDim) !== fitSize) {

				shape.set({ scaleX: (fitSize / maxDim),  scaleY: (fitSize / maxDim) }, {silent: true});
				shape.trigger('change:width');
			}

		},

		setDimensions: function () {

			this.calculateFootprint();
			this.setScaleX();
			this.setScaleY();			

			this.setWidth();
			this.setHeight();
			this.setX();
			this.setY();

		}

	});
	
	return Plan;
	
});