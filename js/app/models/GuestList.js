define(["./Guest", "libs/Backbone.Framework"],

function (Guest) {

    var GuestList = Backbone.Collection.extend({

        model: Guest,

        updateAll: function (tid) {

            _(this.models).each(

                function (guest) {

                    if (tid == guest.get('tableId') || guest.get('tableId') == null) {
                   
                        guest.set({ tableId: tid });
                    }
                }
			);

            var collection = this;

            options = {
                success: function (model, resp, xhr) {
                    collection.reset(model);
                }
            };

            return Backbone.sync('update', this, options);
        }

        //        saveCollectionAtTable: function (tid) {

        //            _(this.models).each(

        //                function (guest) {

        //                    if (tid == guest.get('tableId') || guest.get('tableId') == null) {
        //                        guest.set({ tableId: tid });
        //                        guest.save();
        //                    }
        //                }
        //			);
        //        }

    });

    return GuestList;

});