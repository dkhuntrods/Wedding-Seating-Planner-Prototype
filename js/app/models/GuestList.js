define(["./Guest", "libs/Backbone.Framework"], 

function(Guest) {
    
	var GuestList = Backbone.Collection.extend({
		
		model: Guest,

		saveCollectionAtTable: function(tid) {

			_(this.models).each(

				function(guest){

					if (tid == guest.get('tableId')) {
						//guest.save();
					}
				}
			)
		}
		
	});
	
	return GuestList;
	
});