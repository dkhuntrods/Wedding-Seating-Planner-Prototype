Genders = { FEMALE: 1, MALE: 2 };
AgeRanges = { ADULT: 1, CHILD: 2 };

var Person = Backbone.Model.extend({

    defaults: {
        name: {
            prefix: "Dr.",
            foreName: "Barbra",
            infix: "Jane",
            surName: "Higgins",
            suffix: "MD"
        },
        gender: Genders.FEMALE,
        ageRange: AgeRanges.ADULT,
		label: '',
		urlRoot: '/'
    },

    initialize: function() {
        
      
		this.set({
            'label': this.get('name').foreName + " " + this.get('name').surName
        });
    }

});