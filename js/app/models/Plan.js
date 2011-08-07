


Plan = Backbone.Model.extend({

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
		_.bindAll(this, 'setDimensions','setWidth', 'setHeight', 'setX', 'setY', 'setScaleFitMode');
		
		var shape = attrs.shape;
		
		//this.setFootprint = this.updateScaleMode();
		
		shape.bind('change:x', this.setX);
		shape.bind('change:y', this.setY);
		
		
		shape.bind('change:width', this.setDimensions);
		shape.bind('change:height', this.setDimensions);
		shape.bind('change:scaleX', this.setDimensions);
		shape.bind('change:scaleY', this.setDimensions);
		
		this.set({ shape: shape });
		
		//this.bind('change:scaleMode', this.setScaleFitMode);
		//this.bind('change:scaleFitSize', this.setScaleFitMode);
		
		this.setDimensions();
		//this.setScaleFitMode();
		
	},
	
	setWidth: function () {
		//console.log('setWidth');
		var shape = this.get('shape'),
			units = shape.get('units'),
			width = shape.get('width') * units.displayFactor(UnitSystems.imperial),
			oWidth = this.get('width');
		
		if ( width != oWidth) {
			//console.log('	width:', width);
			this.set({ width: width });
		}
	},
	
	setHeight: function () {
		//console.log('setHeight');
		var shape = this.get('shape'),
			units = shape.get('units'),
			height = shape.get('height') * units.displayFactor(UnitSystems.imperial),
			oHeight = this.get('height');
		
		if ( height != oHeight) {
			//console.log('	height:', height, oHeight);	
			this.set({ height: height });
		}
			
	},
	
	setX: function () {
		//console.log('setX');
		var shape = this.get('shape'),
			units = shape.get('units'),
			x = shape.get('x') * units.displayFactor(UnitSystems.imperial),
			oX = this.get('x');
		
		if ( x != oX) {
			//console.log('	setX:', x, shape.get('x'));
			this.set({ x: x });
		}
	},
	
	setY: function () {
		//console.log('setY');
		var shape = this.get('shape'),
			units = shape.get('units'),
			y = shape.get('y') * units.displayFactor(UnitSystems.imperial),
			oY = this.get('y');
			
		if ( y != oY) {
			//console.log('	setY:', y);
			this.set({ y: y });
		}		
	},
	
	calculateFootprint: function () {
		//console.log('setX');
		var shape = this.get('shape'),
			units = shape.get('units'),
			footprintWidth = Math.round(shape.get('footprintWidth') * units.displayFactor(UnitSystems.imperial)),
			oFootprintWidth = this.get('footprintWidth'),
			footprintHeight = Math.round(shape.get('footprintHeight') * units.displayFactor(UnitSystems.imperial)),
			oFootprintHeight = this.get('footprintHeight');
			
		//console.log(footprintWidth, oFootprintWidth);
		
		if ( footprintWidth != oFootprintWidth) {
			//console.log('	footprintWidth:', footprintWidth, shape.get('footprintWidth'),units.displayFactor(UnitSystems.imperial),shape.get('scaleX') );
			this.set({ footprintWidth: footprintWidth });
		}
		if ( footprintHeight != oFootprintHeight) {
			//console.log('	footprintHeight:', footprintHeight);
			this.set({ footprintHeight: footprintHeight });
		}
	},
	
	calculateScale: function () {
		var shape = this.get('shape'),
			units = shape.get('units'),
			max = Math.max(shape.get('width'), shape.get('height')),
			
			scale = (this.get('scaleFitSize') / units.displayFactor(UnitSystems.imperial)) / (max + shape.get('buffer') * 2),
			oScaleX = this.get('scaleX'),
			oScaleY = this.get('scaleY');
		
		if (scale != oScaleX || scale != oScaleY) {
			this.set({ scaleX: scale, scaleY: scale });
		} 
	},
	
	setFootprintHeight: function () {
		//console.log('setY');
		var shape = this.get('shape'),
			units = shape.get('units'),
			footprintHeight = Math.round(shape.get('footprintHeight') * units.displayFactor(UnitSystems.imperial)),
			oFootprintHeight = this.get('footprintHeight');
		
		if ( footprintHeight != oFootprintHeight) {
			//console.log('	footprintHeight:', footprintHeight);
			this.set({ footprintHeight: footprintHeight });
		}
	},
	
	setScaleX: function () {
		var shape = this.get('shape'),
			units = shape.get('units'),
			scaleX = shape.get('scaleX'),
			oscaleX = this.get('scaleX');
			
		if ( scaleX != oscaleX) {
			//console.log('	scaleX:', scaleX);
			this.set({ scaleX: scaleX });
		}
	},
	
	setScaleY: function () {
		var shape = this.get('shape'),
			units = shape.get('units'),
			scaleY = shape.get('scaleY'),
			oscaleY = this.get('scaleY');
			
		if ( scaleY != oscaleY) {
			//console.log('	scaleY:', scaleY);
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
		
//console.log( maxDim, fitSize);
		if ( (maxDim) !== fitSize) {
			//console.log('setScaleFitMode', footprintWidth, footprintHeight, maxDim, fitSize/maxDim);
			shape.set({ scaleX: (fitSize / maxDim),  scaleY: (fitSize / maxDim) }, {silent: true});
			shape.trigger('change:width');
		}
		
		//this.setScaleY();	
	},
	
	updateScaleMode: function () {
		//console.log('updateScaleMode', this.get('scaleMode'));
		
		var scaleFunction;
		
		switch (this.get('scaleMode')) {
		case ScaleMode.FIT: 
			scaleFunction = this.footprintConstantScaleVaries;
			break;
		case ScaleMode.NONE: 
			scaleFunction = this.scaleConstantFootprintVaries;
			break;
		default:
			scaleFunction = this.scaleConstantFootprintVaries;
			break;
		}
		return scaleFunction;
	},
	
	
	scaleConstantFootprintVaries: function () {
	//	console.log('renderNoScale ', this.get('scaleX'), this.get('scaleY'));
					
		this.setFootprintWidth();
		this.setFootprintHeight();
		this.setScaleX();
		this.setScaleY();
	},
	
	
	footprintConstantScaleVaries: function () {
		//console.log('renderFit ');
		
		this.set({ footprintWidth: this.fitSize, footprintHeight: this.fitSize });
		
	},
	
	setDimensions: function () {
		
		//console.log('[Plan] setDimensions', this.cid)
		
		//if (this.get('scaleMode') === ScaleMode.FIT) {
		//	this.calculateScale();
		//} else {
			//this.calculateFootprint();
		//}
		
		this.calculateFootprint();
		this.setScaleX();
		this.setScaleY();			
			
		this.setWidth();
		this.setHeight();
		this.setX();
		this.setY();
		
	}
	
});