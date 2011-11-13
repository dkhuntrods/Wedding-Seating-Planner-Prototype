Sides = {
	init : -1,
	bride : 0,
	groom : 1
}

define(["./Person", "libs/Backbone.Framework"],

function (Person) {

    var Guest = Person.extend({

        defaults: _(Person.prototype.defaults).extend({
            seat: null,
            household: 'h1',
            side: -1
        }),

        initialize: function (attrs) {

            Person.prototype.initialize.call(this, attrs);

            if (attrs.seat) setSeat(attrs.seat);
        },

        setSeat: function (seat) {
            var tableId = seat.get('table') && seat.get('table').get('id');
            var eSeat = this.get('seat') && this.get('seat').get('slot')

            if (seat != this.get('seat')) {

                this.set({ seat: seat, tableId: tableId, seatSlot: seat.get('slot') });
            }
        },

        unsetSeat: function (seat) {
            var table = this.get('seat') && this.get('seat').get('table') && this.get('seat').get('table').get('id');
            var sCid = seat && seat.cid;
            var tsCid = this.get('seat') && this.get('seat').cid

            if (seat === this.get('seat')) {

                this.unset('seat');
                this.unset('tableId');
                this.unset('seatSlot');
				
				if (this.url) this.save();
            }

            

        },

        toJSON: function () {

            var a = this.attributes;
            return {
                "id": this.id,
                "contactId": a.contactId,
                "name": _.clone(a.name),
                "gender": a.gender,
                "ageRange": a.ageRange,
                "label": a.label,
                "seatSlot": _.clone(a.seatSlot),
                "tableId": a.tableId,
                "household": a.household,
                "side": a.side
            };
        }

    });

    return Guest;

});