define(["app/models/AppModel", "app/views/AppView", "app/router/AppRouter"], 

function(AppModel, AppView, AppRouter) {
	
	return function(attrs) {
		
		var appModel = new AppModel({ shapesURL: 'data/tables.json', guestsURL: 'data/guests.json', roomURL: 'data/room.json' });
		var appView = new AppView({ model: appModel, el: '#app' });
		var appRouter = new AppRouter({ model: appModel, view:appView });
		
		appModel.load();
		appView.render();
		
		Backbone.history.start();
		
		return {
			appModel: appModel
		}
	}
	

});