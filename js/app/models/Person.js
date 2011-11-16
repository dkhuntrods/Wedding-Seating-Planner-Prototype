Genders = { FEMALE: 1, MALE: 2 };
AgeRanges = { ADULT: 1, CHILD: 2 };


define(["libs/Backbone.Framework"], 

function() {
    
	var Person = Backbone.Model.extend({
		
		defaults: {
	        name: {
	            prefix: "Dr.",
	            foreName: "Barbra",
	            infix: "Jane",
	            surName: "Higgins",
	            suffix: "MD"
	        },
	        gender: 0,
	        ageRange: 0,
			label: '',
			urlRoot: '/'
	    },

	    initialize: function(attrs) {
			
			if (this.get('label') == '') {
			
				this.set({
		            'label': this.get('name').foreName + " " + this.get('name').surName
		        });
			}
	    }
		
	});
	
	return Person;
	
});