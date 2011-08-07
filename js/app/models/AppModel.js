AppModel = Backbone.Model.extend({
	
	
	initialize: function(attrs) {
		_.bindAll(this, 'shapeSuccess', 'guestSuccess');
		
		this.units = new Units();
		
		this.shapes = new ShapeList([], { units: this.units });	
		this.shapes.url = attrs.shapesURL;	
		
		this.guests = new GuestList();
		this.guests.url = attrs.guestsURL;
		
		this.editShape = new Furniture({ name: 'Table 1', units: this.units });		
		
		this.editModel = new EditShapeWithGuests({ editShape: this.editShape, guests: this.guests, shapes: this.shapes, units: this.units});
		this.editRouter = new EditShapeWithGuestsRouter({ model: this.editModel });
		
		this.roomContainer = new RoomContainer({ units: this.units });
	
	},
	
	load: function () {
		this.shapes.fetch({ success: this.shapeSuccess });
	},
	
	shapeSuccess: function(collection, response) {
		this.guests.fetch({ success: this.guestSuccess });
	},
	
	guestSuccess: function(collection, response) {
		//console.log(collection, this.guests);
		this.guests.each( function(guest) {
			//console.log(guest);
			var tableId = guest.get('tableId'),
				seatSlot = guest.get('seatSlot'),
				table, seat;
			
			if ( tableId && seatSlot ) {
				
				table = this.shapes.find( function(shape){
					return shape.get('id') === tableId;
				});
			
				if (table) {
					//console.log('table');
					seat = table.seats.find(function(s){ 
						//console.log(s.get('slot'), seatSlot, _.isEqual(s.get('slot'), seatSlot))
						return _.isEqual(s.get('slot'), seatSlot);
					});
					
					if (seat) {
						//console.log('seat')
						seat.setGuest(guest)
					}
				}
			}
		}, this);
	},
	
	removeShape: function(shape) {
		console.log('[SeatingPlannerAppModel] removeShape');
		if (shape.seats) {			
			shape.seats.each(this.removeGuestFromSeat);
		}
		this.shapes.remove(shape);
		//shape.destroy();
	},
	
	removeShapeByID: function (id) {		
		console.log('[SeatingPlannerAppModel] removeShapeByID', id);		
		this.removeShape(this.shapes.getByCid(id));
	},
	
	duplicateShapeByID : function (cid) {
		console.log('[SeatingPlannerAppModel] duplicateShapeByID', cid);
		
		//var shape = this.shapes.getByCid(cid).clone(),
			//order = this.shapes.nextOrder();
		
		
		var order = this.shapes.nextOrder(),
		name = 'Table '+order,
		id = 'table'+ order,
		
		etJSON = this.shapes.getByCid(cid).toJSON();
		console.log(etJSON, etJSON.seatSlots);
		console.log(this.shapes.getByCid(cid).clone())
		etJSON.id = id;
	 	etJSON.order = order;
		etJSON.name = name;
		etJSON.units = this.units;

		var table = new Furniture(etJSON, {silent:true});
		this.shapes.add(table);
		
		
		if (table.hasChanged('type')) table.trigger('change:type');
		if (table.hasChanged('width')) table.trigger('change:width');	
		if (table.hasChanged('height')) table.trigger('change:height');
		table.trigger('change:seatSlots');	
		
	},
	
	clearShapes : function () {
		console.log('[SeatingPlannerAppModel] removeAllShapes', this.shapes.length);
	
		while (this.shapes.length) {
			this.removeShape(this.shapes.last());
		}		
	},
	
	addRandomShape : function () {		
		console.log('[SeatingPlannerAppModel] addRandomShape', this.shapes.length);
		var shapeData = _({ units: this.units }).extend(InitData.getRandomShape(this.shapes));
		this.shapes.add(shapeData);	
	},
	
	removeGuestFromSeat: function (seat) {
		console.log('[EditShapeModel] removeGuestFromSeat');		
		
		var guest;
		
		if (guest = seat.get('guest')) { 
			console.log('	[EditShapeModel] removeGuestFromSeat', guest.get('label'));			
			seat.unsetGuest(guest);			
		}		
	}
	
	
});