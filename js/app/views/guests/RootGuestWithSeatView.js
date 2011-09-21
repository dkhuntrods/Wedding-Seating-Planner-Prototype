define(["./RootGuestView", "app/models/Plan", "libs/Backbone.Framework"], 

function(RootGuestView, Plan) {
    
	var RootGuestWithSeatView = RootGuestView.extend({

		className: 'guest',

		initialize: function(attrs) {
			_.bindAll(this, 'handleSeatChanged', 'positionGuest', 'helper');

			RootGuestView.prototype.initialize.call(this, attrs);

			this.model.bind('change:seat', this.positionGuest);
			this.model.bind('change:seat', this.handleSeatChanged);

			this.positionGuest();
			this.handleSeatChanged();

			$(this.el).draggable( "option", "helper", this.helper);
		},

		helper: function () {
			return $(this.el).clone().prepend( $('<span></span>').addClass('i i'+this.model.get('ageRange') + this.model.get('gender')) );		
		},

		handleSeatChanged: function () {

			var seat, table;

			if (seat = this.model.get('seat')) {
				if (table = seat.get('table')) {				

					table.bind('change:width', this.positionGuest);
					table.bind('change:height', this.positionGuest);
					table.bind('change:scaleX', this.positionGuest);
					table.bind('change:scaleY', this.positionGuest);
					table.bind('change:seatSlots', this.positionGuest);
				} 
			} else {
				this.removeViews(this.model);
			}	

		},

		positionGuest: function () {

			if (this.model.get('seat')) {

				$(this.el).css({left: 0, top: 0 });
				$(this.el).attr('class', this.getClass(this.model) ).css( this.getCSS(this.model));
				$(this.el).css( this.getCSS(this.model) );
			}
		},

		getCSS: function (model) {

			var	css = { position: 'absolute' },
				seat = model.get('seat'),
				units = seat.get('table').get('units'),
				factor = units.displayFactor(UnitSystems.imperial),
				scale = seat.get('table').get('scaleX'),
				plan = new Plan({ shape: seat.get('table') });
				footprintWidth = seat.get('table').get('footprintWidth'),
				footprintHeight = seat.get('table').get('footprintHeight'),
				pi = Math.PI,
				rot = seat.get('rotation'),	
				x = Math.round( (seat.get('x')) * factor * scale  + footprintWidth * 0.5 * factor),
				y = Math.round( (seat.get('y')) * factor * scale  + footprintHeight * 0.5 * factor);


			css.left = x, css.top = y;
			return css;
		},

		getClass: function (model) {

			var	seat = model.get('seat'),
				pi = Math.PI,
				rot = seat.get('rotation'),
				className = this.className +' dq ui-draggable';			

			switch (true) {

			case (0 * pi) < rot && rot <=  (pi * 0.5):
				className += ' q1';
				break;

			case (pi * 0.5) < rot && rot <=  pi: 

				className += ' q2';
				break;

			case pi < rot && rot <=  (pi * 1.5) : 

				className += ' q3';
				break;

			case (pi * 1.5) < rot && rot <=  (pi * 2) || rot == 0:

				className += ' q4';
				break;
			}


			return className;
		}

	});
	
	return RootGuestWithSeatView;
	
});