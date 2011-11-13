define(["libs/Backbone.Framework"],

function () {

    var GuestNameAbbrView = Backbone.View.extend({

        templateId: '#guest-name-template',

        initialize: function (attrs) {

            this.templateId = attrs.templateId || this.templateId;

            _.bindAll(this, 'render', 'removeView');
            if (this.model) this.setModel(this.model);
        },

        setModel: function (model) {
            this.model = model;
            this.model.bind('change:name', this.render);
            this.model.bind('remove', this.removeView);
        },

        render: function () {

            var template = _.template($(this.templateId).html()),
				foreName = this.model.get('name').foreName,
				initial = this.model.get('name').surName.slice(0, 1).toUpperCase();
            var attr = {
                label: foreName + ' ' + initial
            };
            
            this.el = template(attr);

            return this;
        },

        removeView: function () {
            this.remove();
            this.model.unbind();
        }

    });

    return GuestNameAbbrView;

});