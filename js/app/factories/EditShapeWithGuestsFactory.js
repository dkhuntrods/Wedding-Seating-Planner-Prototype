function EditShapeWithGuestsFactory() {};

EditShapeWithGuestsFactory.prototype = {

	create : function (model) {
		
		var gParams = {
			model: model.guests, 
			factory: new GuestFactory(), 
			tagName:'ul', 
			className: 'guest-list guest-list-unassigned',
			droppable: true,
			droppableParams: { accept: '.guest-list-assigned li' }
		}
		
		var editView = new EditFurnitureView({ model: model.editShape, factory: new TableEditComponentsFactory(), className: 'edit-shape' });
		var guestView = new UnassignedGuestListView(gParams);
		
	
		var moveGuestView = new ShapeMoveGuestListView({ model: model.moveGuest, className:'shape-list shape-list-move-guest' });
		var exitView = new ExitEditTableView({ model : model });
		
		
		return { editView:editView, guestView:guestView, moveGuestView:moveGuestView, exitView:exitView };
	}
	
};