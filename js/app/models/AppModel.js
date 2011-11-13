define(["./Units", "./ShapeList", "./GuestList", "./Furniture", "./EditShapeWithGuests",
		"app/router/EditShapeWithGuestsRouter", "./RoomContainer", "libs/Backbone.Framework"],

function (Units, ShapeList, GuestList, Furniture, EditShapeWithGuests, EditShapeWithGuestsRouter, RoomContainer) {
    var AppModel = Backbone.Model.extend({
        initialize: function (attrs) {
            _.bindAll(this, 'shapeFetchSuccess', 'guestFetchSuccess');

            this.units = new Units();

            this.shapes = new ShapeList([], { units: this.units });
            this.shapes.url = attrs.shapesURL;

            this.guests = new GuestList();
            this.guests.url = attrs.guestsURL;

            this.editShape = new Furniture({ name: 'Table 1', units: this.units, seatOffset: 0.6, buffer: 3.5 });

            this.editModel = new EditShapeWithGuests({ editShape: this.editShape, guests: this.guests, shapes: this.shapes, units: this.units });

            this.editRouter = new EditShapeWithGuestsRouter({ model: this.editModel });

            this.roomContainer = new RoomContainer({ units: this.units, url: attrs.roomURL });
            this.roomContainer.room.url = attrs.roomURL;

        },

        load: function () {
            if (!this.shapes) return;
			console.log('load', this.shapes.url)
			
            this.shapes.fetch({ success: this.shapeFetchSuccess, error: function(c, r){ console.log(r) } });
            this.roomContainer.room.fetch();

        },

        shapeFetchSuccess: function (collection, response) {
            if (!this.guests) return;

            this.guests.fetch({ success: this.guestFetchSuccess });
        },

        guestFetchSuccess: function (collection, response) {
            if (!this.guests) return;

            this.guests.each(function (guest) {
                var tableId = guest.get('tableId'),
					seatSlot = guest.get('seatSlot'),
					table, seat;

                if (tableId && seatSlot) {

                    table = this.shapes.find(function (shape) {
                        return shape.get('id') === tableId;
                    });

                    if (table) {
                        seat = table.seats.find(function (s) {
                            return _.isEqual(s.get('slot'), seatSlot);
                        });

                        if (seat) {
                            seat.setGuest(guest)
                        }
                    }
                }
            }, this);
        },

        removeShape: function (shape) {
            var that = this;

            if (shape) {
                if (shape.seats) {
                    shape.seats.each(this.removeGuestFromSeat);
                }
                //this.shapes.remove(shape);
                shape.destroy();
            }
        },

        removeShapeByID: function (id) {
            if (!this.shapes || !this.shapes.getByCid(id)) return;
            this.removeShape(this.shapes.getByCid(id));
        },

        duplicateShapeByID: function (cid) {

            if (!this.shapes || !this.shapes.getByCid(cid)) return;

            var order = this.shapes.nextOrder(),
			name = 'Table ' + order,
			id = 'table' + order,
			et = this.shapes.getByCid(cid),
			etJSON = et.toJSON();

            var table = new Furniture({
                id: id,
                x: etJSON.x,
                y: etJSON.y,
                units: this.units,
                name: name,
                order: order,
                type: etJSON.type,
                buffer: etJSON.buffer,
                width: etJSON.width,
                height: etJSON.height,
                elbowRoom: etJSON.elbowRoom,
                footprintWidth: etJSON.footprintWidth,
                footprintHeight: etJSON.footprintHeight,
                scaleX: et.get('scaleX'),
                scaleY: et.get('scaleY'),
                seatSlots: etJSON.seatSlots.concat()
            });

            this.shapes.add(table);

            table.save();

        },

        clearShapes: function () {

            while (this.shapes && this.shapes.length) {
                this.removeShape(this.shapes.last());
            }
        },

        removeGuestFromSeat: function (seat) {

            var guest;

            if (seat && (guest = seat.get('guest'))) {
                seat.unsetGuest(guest);
            }
        }

    });

    return AppModel;

});


