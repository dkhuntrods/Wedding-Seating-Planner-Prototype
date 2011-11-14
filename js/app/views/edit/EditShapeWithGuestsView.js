define(["libs/Backbone.Framework"],
    function () {

        var EditShapeWithGuestsView = Backbone.View.extend({
            className: 'edit-shape-guests-wrap',

            events: {
                'drop .edit-shape .shape': 'handleShapeDrop',
                'drop .guest-list': 'handleGuestListDrop',
                'change .shapeSelection select': 'setSelection',
                'click .move-cancel': 'clearMoveUI'
            },

            initialize: function (attrs) {
                _.bindAll(this, 'render', 'handleShapeDrop', 'handleGuestListDrop', 'handleStateChange', 'setSelection', 'clearMoveUI');

                var views = attrs.factory.create(this.model);
                this.editView = views.editView;
                this.guestView = views.guestView;
                this.moveGuestView = views.moveGuestView;
                this.exitView = views.exitView;

                this.model.bind('change:state', this.handleStateChange);
                this.model.editShape.bind('change:seatSlots', this.setSelection);
                this.handleStateChange();


            },

            render: function () {
                $(this.el).append('<div class="edit-shape-guests"></div>');
                this.$('.edit-shape-guests').append(this.exitView.render().el);
                this.$('.edit-shape-guests').append(this.editView.render().el);
                this.$('.edit-shape-guests').append(this.guestView.render().el);
                this.$('.edit-shape-guests').append(this.moveGuestView.render().el);
                this.setSelection();
                return this;
            },

            handleStateChange: function () {
                $(this.el).attr('class', this.className + ' ' + this.model.get('state'));

                if (_(this.model.get('state').split(' ')).indexOf('move-guest') > 0) {
                    this.$('.shape-list-move-guest').show();
                } else {
                    this.$('.shape-list-move-guest').hide();
                }
			
            },

            handleShapeDrop: function (event, ui) {

                var data = $(ui.draggable).data(),
                        model = this.editView.shapeView.model,
                        shape = model.get('shape'),
                        units = shape.get('units'),
                        canvas = $(event.target).find('canvas'),
                        ox = canvas.offset().left,
                        oy = canvas.offset().top,
                        px = ui.position.left,
                        py = ui.position.top,
                        x0 = px - ox - model.get('footprintWidth') * 0.5,
                        y0 = py - oy - model.get('footprintHeight') * 0.5,
                        x1 = x0 / units.displayFactor(UnitSystems.imperial) * model.get('scaleX'),
                        y1 = y0 / units.displayFactor(UnitSystems.imperial) * model.get('scaleY'),
                        tCid = shape.cid,
                        gCid = data.gCid,
                        ptCid = data.tCid,
                        psCid = data.sCid,
                        hitseat = shape.checkClosest(x1, y1) || shape.getFirstEmptySeat(),
                        sCid, route, guest, previousGuest;

                if (hitseat) {

                    sCid = hitseat.cid;

                    if (ptCid && psCid) {
                        this.model.transferGuestBetweenSeatsByCid(ptCid, psCid, tCid, sCid);
                    } else if (gCid) {
                        this.model.moveGuestToShapeByCid(gCid, tCid, sCid);
                    }

                }

            },

            handleGuestListDrop: function (event, ui) {

                var data = $(ui.draggable).data(),
                        gCid = data.gCid,
                        ptCid = data.tCid,
                        psCid = data.sCid;

                if (ptCid && psCid) {
                    this.model.removeGuestFromShapeByCid(ptCid, psCid);
                }
            },

            setSelection: function (event) {
               
                var slots = this.model.editShape.get('seatSlots');

                var sum = _.reduce(slots, function (memo, num) { return memo + num; }, 0);
               
                if (sum <= 0) {
                    this.$('.guest-list').hide();
                } else {
                    this.$('.guest-list').show();
                }
            },

            clearMoveUI: function () {
                this.model.set({ state: 'active' });
            }
        });

        return EditShapeWithGuestsView;

    });