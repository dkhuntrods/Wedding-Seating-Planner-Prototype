require(["app/AppMain"], 

function(AppMain) {
    
	var appMain = new AppMain({ el:'#app', shapesURL: 'data/tables.json', guestsURL: 'data/guests.json', roomURL: 'data/room.json' });
	
});
