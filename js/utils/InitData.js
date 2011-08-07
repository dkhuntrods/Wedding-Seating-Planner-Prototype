InitData = {
	
	foreNames: ['Fred', 'Mary', 'Sam', 'Penelope', 'Chloe', 'Armani', 'Giovanni', 'Sumaiya'],
	surNames: ['Octavius', 'Maricich', 'Rafe', 'Abdullahi', 'Christopher', 'Jones', 'Mohamad', 'Smith'],
	ageRanges: [1,2,2,1,1,2,2,1],
	genders: [2,1,2,1,1,2,2,1],
	
	getRandomGuest : function() {

		var foreName = this.foreNames[Math.randomRange(0, this.foreNames.length - 1)],
			surName = this.surNames[Math.randomRange(0, this.surNames.length - 1)],
			ageRange = Math.randomRange(1, 2),
			gender = Math.randomRange(1, 2),
			
			guest = new Guest({
            name: {
                foreName: foreName,
                surName: surName
            },
            ageRange: ageRange,
            gender: gender
        });

		return guest;
	},
	
	getGuest: function (index){
		var foreName = this.foreNames[index],
			surName = this.surNames[index],
			ageRange = this.ageRanges[index],
			gender = this.genders[index],
			
			guest = new Guest({
            name: {
                foreName: foreName,
                surName: surName
            },
            ageRange: ageRange,
            gender: gender

        });

		return guest;
	},
	
	getGuestList : function(number) {

		var list = [];
		
		for (var i = 0, j = number; i < j; i++ ) {
			list[ list.length ] = this.getRandomGuest();
		}
		
		return list;
	},
	
	
	getGuestListInc: function (number){
		var list = [];
		
		for (var i = 0, j = number; i < j; i++ ) {
			list[ list.length ] = this.getGuest( i % (this.foreNames.length) );
		}
		
		return list;
	},
	
	getShapesInitParams : function () {
		var options = [
			{ label : "Pick a shape", value : Shapes.init.id, selected: true }, 
			{ label : "Circular", value : Shapes.ellipse.id, selected: false }, 
			{ label : "Rectangular", value : Shapes.rectangle.id, selected: false }
		];
		
		return {
			options : new ShapeOptions(options),
			selected : Shapes.init.id//options[0];
		}
	},
	
	
	getSeatInputParams : function(id) {

		var seatInputs = []; 
		var items = 0;

		switch(id) {
			case Shapes.ellipse.id :
				items = 1;
				break;
			case Shapes.rectangle.id :
				items = 4;
				break;
		}

		for ( var i = 0; i < items; i++ ) {
			seatInputs[seatInputs.length] = { value: '' };
		}

		return seatInputs;
	},
	
	getTableList : function( model, number ) {
		
		while( number-- ) {
			model.add( this.getRandomTable(model), { silent : true } );		
		}		
	},
	
	getRandomShape : function(model) {
		
		var types = [ FurnitureShapeTypes.ellipse, FurnitureShapeTypes.rectangle, FurnitureShapeTypes.custom ],
			order = model && _.isFunction(model.nextOrder) ? model.nextOrder() : 1,
			type = types[Math.randomRange(0, 2)],
			seatSlots = this.getSeatSlots(type);
		
		console.log( '[TableController] getRandomTable' , order);
		
		return { 
			name : "Table " + order,
			type : type,
			width : Math.randomRange(4, 8), 
			height : Math.randomRange(4, 8),
			seatSlots : seatSlots,
			order : order
		}
	},
	
	getTableInc : function(model, xI, yI, t) {
		
		var order = model && _.isFunction(model.nextOrder) ? model.nextOrder() : 1,		
			seatSlots = this.getSeatSlotsInc(t);
			inc = 25;
		
		return { 
			name : "Table " + order,
			type : t,
			width : xI, 
			height : yI,
			seatSlots : seatSlots,
			order : order
		}
		
	},
	
	getSeatSlotsInc : function(type) {

		var firstRange = Math.randomRange(3, 12),
			seatSlots = [];

		switch (type) {
			case Shapes.ellipse :
				seatSlots = [ 8 ];
				break;
			case Shapes.rectangle :
				seatSlots = [ 2, 2, 2, 2];
				break;
		}

		return seatSlots;
	},
	
	getSeatSlots : function(type) {

		var firstRange = Math.randomRange(3, 12),
			seatSlots = [];

		switch (type) {
			case FurnitureShapeTypes.ellipse :
				seatSlots = [ firstRange ];
				break;
			case FurnitureShapeTypes.rectangle :
				seatSlots = [ Math.randomRange(0, 4), Math.randomRange(0, 4), Math.randomRange(0, 4), Math.randomRange(0, 4)];
				break;
			case FurnitureShapeTypes.custom :
				seatSlots = [];
				break;
		}

		return seatSlots;
	}
};

