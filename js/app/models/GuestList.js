GuestList = Backbone.Collection.extend({
	
	model: Guest,
	
	saveCollectionAtTable: function(tid) {
		console.log('saveCollectionAtTable', tid)
		
		_(this.models).each(
			
			function(guest){
				console.log('saveCollection');
				if (tid == guest.get('tableId')) {
					//guest.save();
				}
			}
		)
	}
	
});