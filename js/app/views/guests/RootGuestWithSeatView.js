$(function(){

RootGuestWithSeatView = RootGuestView.extend({
	
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
		//console.log('[RootGuestWithSeatView] handleSeatChanged', this.model.get('seat'));
		var seat, table;
		
		if (seat = this.model.get('seat')) {
			if (table = seat.get('table')) {				
				//console.log('	handleSeatChanged')
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
		
		//console.log('[RootGuestWithSeatView] positionGuest');
		if (this.model.get('seat')) {
			
			$(this.el).css({left: 0, top: 0 });
			$(this.el).attr('class', this.getClass(this.model) ).css( this.getCSS(this.model));
			$(this.el).css( this.getCSS(this.model) );
		}
	},
	
	getCSS: function (model) {
		//console.log('[RootGuestWithSeatView] get CSS');
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
			
			//c = console.log(seat.get('table'), footprintWidth)		
			x = Math.round( (seat.get('x')) * factor * scale  + footprintWidth * 0.5 * factor),
			y = Math.round( (seat.get('y')) * factor * scale  + footprintHeight * 0.5 * factor);
		
		/*
		switch (true) {

		case (0 * pi) < rot && rot <=  (pi * 0.5):
			css.rotate = pi * 1.7+'rad';
			css.translate = ['0', '-20%'];
			//className += ' q1';
			break;

		case (pi * 0.5) < rot && rot <=  pi: 
			//console.log(pi * 0.25, rot, pi * 0.75, 'area2');
			//className += ' q2';
			css.rotate = pi * 0.2+'rad';
			css.translate = ['-20%', '-20%'];
			break;

		case pi < rot && rot <=  (pi * 1.5) : 
			//console.log(pi * 0.75, rot, pi * 1.25, 'area3');
			//className += ' q3';
			css.rotate = pi * 1.7+'rad';
			css.translate = ['-80%', '-20%'];
			break;

		case (pi * 1.5) < rot && rot <=  (pi * 2) || rot == 0:
			//console.log(pi * 1.25, rot, pi * 1.75, 'area4');
			//className += ' q4';
			css.rotate = pi * 0.2+'rad';
			css.translate = ['-100%', '-40%'];
			break;
		}
		*/
		/*
		.q1, .q2,
		.q3, .q4 { .origin(0px, 50%);}

		.q1	{ .transform(@pi * 1.7rad, 0, -20%); } .q2 { .transform(@pi * 0.2rad, -20%, -20%); }
		.q3	{ .transform(@pi * 1.7rad, -80%, -20%); } .q4 { .transform(@pi * 0.2rad, -100%, -40%); }
		*/
		
		//console.log('[RootGuestWithSeatView] get CSS', model.get('label'), seat.get('x'), seat.get('y'), x, y);
		css.left = x, css.top = y;
		//css.origin = ['0px', '50%'];
		return css;
	},
	
	getClass: function (model) {
		//console.log('[RootGuestWithSeatView] get getClass', model.get('seat').cid);
		var	seat = model.get('seat'),
			pi = Math.PI,
			rot = seat.get('rotation'),
			className = this.className +' dq ui-draggable';			
		
		switch (true) {

		case (0 * pi) < rot && rot <=  (pi * 0.5):
			className += ' q1';
			break;

		case (pi * 0.5) < rot && rot <=  pi: 
			//console.log(pi * 0.25, rot, pi * 0.75, 'area2');
			className += ' q2';
			break;

		case pi < rot && rot <=  (pi * 1.5) : 
			//console.log(pi * 0.75, rot, pi * 1.25, 'area3');
			className += ' q3';
			break;

		case (pi * 1.5) < rot && rot <=  (pi * 2) || rot == 0:
			//console.log(pi * 1.25, rot, pi * 1.75, 'area4');
			className += ' q4';
			break;
		}
		
		
		return className;
	}
	
});

});