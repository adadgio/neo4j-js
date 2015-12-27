/**
 * NodeType form.
 */
define([
    'templating',
    'framework/Component/Neo4j/Factory',
    'bundles/AppBundle/Component/Form/DataTransformer/RelationshipTypeTransactions'
], function (Templating, Factory, RelationshipTypeTransactions) {
'use strict';

    var _id  = null;
    var node = {};

    // templates
    var form       = 'form#relationship-form',
        template   = 'templates/form/create_relationship.tpl';

    return {
        bind: function (options) {

            return this;
        },

        /**
         * Get the current form. Useful to retrive form events
         */
        getForm: function () {
            return $(form);
        },

        /**
         * Get the current form. Useful to retrive form events
         */
        getData: function () {
            return $(form).serializeArray();
        },

        /**
         * Get element of a form
         * @param string   Where to render the template
         * @param object   A relationship Object create with the Factory
         * @param function Callback function after template has been rendered
         */
        renderView: function (selector, relationship, callback) {
            var _self = this;

            $.get(template, function(data) {
                var template = Templating.compile(data);
                var html = template({relationship: relationship});

                _self
                    .bind()
                    .getForm()
                    .on('submit', function (e) {
                        callback(e);
                    });
            });
        },

        /**
         * Get the Neo4j statement from the data transormer.
         */
        getTransactions: function (relationship) {
            if (typeof(relationship) === 'undefined') {
                // @todo
                var formData = this.getData();
                var relationship = Factory.createRelationshipFromFormData(formData);
            } else {
                // else we already have an input not and just want to get the transaction queries
            }

            return RelationshipTypeTransactions.getTransactions(relationship);

        }
    };

});
