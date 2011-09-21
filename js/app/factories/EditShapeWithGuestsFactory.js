define(["app/views/shapes/EditFurnitureView", "app/views/shapes/ShapeMoveGuestListView", 
		"app/views/edit/ExitEditTableView", "app/views/guests/UnassignedFilteredGuestView",
		"./GuestFactory", "./TableEditComponentsFactory", 
		"libs/Backbone.Framework"], 

function(EditFurnitureView, ShapeMoveGuestListView, ExitEditTableView, UnassignedFilteredGuestView, GuestFactory, TableEditComponentsFactory) {
    
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
			var guestView = new UnassignedFilteredGuestView({ model: model });

			var moveGuestView = new ShapeMoveGuestListView({ model: model.moveGuest, className:'shape-list shape-list-move-guest' });
			var exitView = new ExitEditTableView({ model : model });

			return { editView:editView, guestView:guestView, moveGuestView:moveGuestView, exitView:exitView };
		}

	};
	
	return EditShapeWithGuestsFactory;
	
});