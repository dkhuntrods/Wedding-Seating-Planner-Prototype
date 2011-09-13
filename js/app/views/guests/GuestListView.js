//$(function(){

GuestListView = Backbone.View.extend({

	className: 'guest-list',
	tagName:'ul',
	emptyMessageTemplateId: '#guest-list-empty-template', 
	
	events : {		
		'drop': 'handleDrop'
	},
	
	initialize: function (attrs) {
		_.bindAll(this, 'render', 'reset', 'addItem', 'removeItem', 'handleDrop', 'checkClass' );
		
		this.model.bind('add', this.addItem);
		this.model.bind('remove', this.removeItem);
		this.model.bind('reset', this.reset);
		this.model.bind('all', this.checkClass);
		
		this.factory = attrs.factory;
		this.emptyMessageTemplateId = attrs.emptyMessageTemplateId || this.emptyMessageTemplateId;
		this.views = {};
		
		this.draggable = attrs.draggable;
		this.draggableParams = attrs.draggableParams;
		this.droppable = attrs.droppable;
		this.droppableParams = attrs.droppableParams;
		
		if (this.draggable) $(this.el).draggable(this.draggableParams);
		if (this.droppable) $(this.el).droppable(this.droppableParams);
		
		this.checkClass();
	},
	
	reset: function () {
		
		emptyTemplate = _.template($(this.emptyMessageTemplateId).html()),
		
		$(this.el).empty();
		
		if (this.model.length > 0) {
			this.model.each ( this.addItem, this );
		} else {
			$(this.el).html(emptyTemplate());
			this.views = {};
		}
	},
	
	render : function () {
		
		
		this.reset();
		return this;
	},
	
	addItem : function( model ) {		
		
		var view = this.factory.create(model);	
		this.views[model.cid] = view;		
		$(this.el).append(view.render().el);
		
	},
	
	handleDrop: function (event, ui){
		
		var dropped = ui.draggable,
			droppedOn = $(this.el),
			top = ui.offset.top - droppedOn.offset().top,
			left = ui.offset.left - droppedOn.offset().left,
			sCid = $(dropped).data().sCid,
			tCid = $(dropped).data().tCid,
			route = 'tables/' + tCid + '/seats/' + sCid + '/guest/remove';
		
		if ( tCid && sCid ) {
			
			Backbone.history.navigate(route, true);
		}
		
	},
	
	removeItem : function ( model ) {		
		
		var index = this.model.indexOf(model);
		
		
		if ( index < 0 && this.views[model.cid]) {
			this.views[model.cid].remove(); 
			delete this.views[model.cid];
		}			
	},
	
	checkClass: function () {
		
		if(this.model.length) {
			if ( this.model.length > 0){
				$(this.el).removeClass('inactive').addClass('active');
			} else {
				$(this.el).removeClass('active').addClass('inactive');
			}
		}
	}
	
});

//});