Grid = PhysicalShape.extend({
	
	defaults: _({ 	
		colWidth : 1,
		rowHeight : 1,
	}).extend(PhysicalShape.prototype.defaults)
	
})