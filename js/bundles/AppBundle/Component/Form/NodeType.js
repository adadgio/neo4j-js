/**
 * NodeType form.
 */
define([
    'templating',
    'framework/Component/Neo4j/NodeFactory',
    'bundles/AppBundle/Component/Form/DataTransformer/NodeTypeTransactions'
], function (Templating, NodeFactory,NodeTypeTransactions) {
'use strict';

    var _id  = null;
    var node = {};

    // templates
    var nid        = 'span#nid',
        form       = 'form#node-form',
        loader     = 'span#node-form-loader',
        properties = 'form#node-form div[data-type="node-properties"]',
        template   = 'templates/form/create_node.tpl';

    var addPropertyButton = 'form#node-form a[data-type="add-node-property"]';
    var delPropertyButton = 'form#node-form a[data-type="remove-node-property"]';

    return {
        bind: function (options) {
            $(addPropertyButton).unbind('click').bind('click', {self:this}, function (e) {
                e.preventDefault();
                var index = $(properties).find('div[data-type="node-property"]').length;
                e.data.self.addNodeProperty(index + 1, function () {});
            });

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
         * @param object   A Node Object create with the NodeFactory
         * @param function Callback function after template has been rendered
         */
        renderView: function (selector, node, callback) {
            var _self = this;

            $(loader).removeClass('hidden');

            $.get(template, function(data) {
                var template = Templating.compile(data);
                var html = template({node: node, mappedProperties: Settings.graph.node.properties, mappedLabels: Settings.graph.label});

                $(selector).html(html);
                $(nid).text('[' + node._id + ']');
                $(loader).addClass('hidden');
                $('a[data-toggle="tooltip"]').tooltip();

                _self
                    .bind()
                    .getForm()
                    .on('submit', function (e) {
                        callback(e);
                    });
            });
        },

        /**
         * Add a new property input(s) to the form
         */
        addNodeProperty: function (index, callback) {
            var _self = this;
            $(loader).removeClass('hidden');

            $.get('templates/form/node_property.tpl', function(data) {
                var template = Templating.compile(data);
                var html = template({index: index,  mappedProperties: Settings.graph.node.properties});

                $(properties).append(html);
                $(loader).addClass('hidden');

                // bind the remove button
                $(delPropertyButton).unbind('click').bind('click', {self:_self}, function (e) {
                    e.preventDefault();
                    e.data.self.removeNodeProperty($(this).attr('data-index'));
                });
            });
            return this;
        },

        /**
         * Add a new property input(s) to the form
         */
        removeNodeProperty: function (index) {
            var property = $(properties).find('div[data-type="node-property"][data-index="'+ index +'"]');
            property.remove();
            return this;
        },

        /**
         * Get the Neo4j statement from the data transormer.
         */
        getTransactions: function (node) {
            if (typeof(node) === 'undefined') {
                var formData = this.getData();
                var node = NodeFactory.createNodeFromFormData(formData);
            } else {
                // else we already have an input not and just want to get the transaction queries
            }

            return NodeTypeTransactions.getTransactions(node);

        }
    };

});
