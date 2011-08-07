function FurnitureListItemDebugFactory () {};

FurnitureListItemDebugFactory.prototype = {

	create : function (table) {
		
		var debugView = new TableDebugView({ model: table});
	
		return debugView;
	}
}
