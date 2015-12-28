/**
 * @namespace \bundles\AppBundle\Controller\
 */
define([
    'templating',
    'framework/Component/Neo4j/Client',
    'framework/Component/Neo4j/Transactions',
    'framework/Component/Neo4j/Factory',
    'bundles/AppBundle/Component/Graph/Graph',
    'bundles/AppBundle/Component/Form/NodeType',
    'bundles/AppBundle/Component/Form/RelationshipType',
    'bundles/AppBundle/Component/Form/NodeSearchType',
], function (Templating, Neo4jClient, Transactions, Factory, Graph, NodeType, RelationshipType, NodeSearchType) {
'use strict';

    var ready = false,
        body  = $('body');

    var graph = new Graph('svg#map');

    var client = new Neo4jClient({
        apiEndpoint: Settings.client.apiEndpoint,
        authBasic:   Settings.client.authBasic,
    });

    return {
        /**
         * Create mode switch selector
         */
        readyState:       '#ready',
        createModeSwitch: 'a[data-toggle="create-mode"]',
        defaultsFormPanel: 'div#create-mode-defaults',
        defaultsFormLabels: 'form[data-type="form-defaults-node"]',
        defaultsFormRelationships: 'form[data-type="form-defaults-relationships"]',

        /**
         * Constructor
         */
        init: function () {
            // init svg graph
            graph.init();

            // bind search node(s) form
            NodeSearchType.bind();

            // must be done before events listeners
            this.initalizeDefaults();

            // main event listeners
            this.addEventListeners();

            // @todo to remove later
            NodeSearchType.setFocus();
        },

        /**
         * Add all custom events listeners.
         */
        addEventListeners: function () {
            var _self = this,
                modal = $('div#modal');
                
            body.on('ui:ready', function (e) {
                ready = true;
                $(_self.readyState).removeClass('not-ready').addClass('ready');
            });

            $(this.createModeSwitch).unbind('click').bind('click', {self:this}, function (e) {
                e.preventDefault();
                e.data.self.onCreateModeToggle($(this));
            });

            graph.$.on('node:click', function (e, d) {
                _self.onNodeClick(d._id);
            });

            graph.$.on('node:dblclick', function (e, d) {
                _self.onNodeExpand(d._id);
            });

            graph.$.on('node:create:promise', function (e, coordinates) {
                _self.onNodeCreatePromise(coordinates);
            });

            graph.$.on('relationship:create:promise', function (e, relationshipData) { // relationship contains a source and target d_.id
                _self.onRelationshipCreatePromise(relationshipData);
            });

            graph.$.on('graph.create:enable', function (e) {
                $(_self.defaultsFormPanel).slideDown('fast');
            });
            graph.$.on('graph.create:disable', function (e) {
                $(_self.defaultsFormPanel).slideUp('fast');
            });

            NodeSearchType.getForm().on('node:search:submit', function (e, transactions) {
                _self.onNodeSearchPostSubmit(transactions);
            });
        },

        /**
         * Initalisze forms default forms on main template.
         */
        initalizeDefaults: function () {
            var _self = this;

            // fill the default form values
            $.get('templates/form/defaults_labels.tpl', function(data) {
                var template = Templating.compile(data);
                var html = template({mappedLabels: Settings.graph.label});
                $(_self.defaultsFormLabels).find('select[name="default_labels"]').html(html);

                // then get relationship defaults
                $.get('templates/form/defaults_relationships.tpl', function(data) {
                    var template = Templating.compile(data);
                    var html = template({mappedRelationships: Settings.graph.relationship});
                    $(_self.defaultsFormRelationships).find('select[name="default_types"]').html(html);

                    body.trigger('ui:ready', []);
                });
            });
        },

        /**
         * What happens when the create mode switch is toggled.
         */
        onCreateModeToggle: function (button) {
            var mode = $(button).attr('data-mode');

            if (mode === 'off') {
                $(button).find('i').removeClass('fa-rotate-180');
                $(button).attr('data-mode', 'on');
                graph.enableCreateMode();

                // also hide node edit form
                NodeType.show();

            } else if (mode === 'on') {
                $(button).attr('data-mode', 'off');
                $(button).find('i').addClass('fa-rotate-180');
                graph.disableCreateMode();

                // also show node edit form
                NodeType.hide();

            } else {
                // yeah, error occured, but practically impossible
            }
        },

        /**
         * Add several search resulsts nodes to the graph on search submit.
         */
        onNodeSearchPostSubmit: function (transactions) {
            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {

                    var nodeA = Factory.createNode(row['_aid'], row['_alabels'], row['a']);
                    graph.addNode(nodeA);

                    if (typeof(row['r']) !== 'undefined' && typeof(row['b']) !== 'undefined') {
                        var nodeB = Factory.createNode(row['_bid'], row['_blabels'], row['b']);
                        graph.addNode(nodeB);

                        graph.addLink(
                            Factory.createRelationship(row['_rtype'], {}, nodeA, nodeB)
                        );
                    }
                });
            });
        },

        /**
         * Trigger when a node is clicked on the graph.
         */
        onNodeClick: function (_id) {
            // the node id..
            var _self = this, transactions = new Transactions();
            transactions.add("MATCH (n) WHERE ID(n) = "+ _id +" RETURN n, ID(n) AS _id, labels(n) AS _labels");

            client.commit(transactions, function (resultSet) {
                var row = resultSet.getDataset()[0];
                _self.createNodeEditForm(Factory.createNode(row['_id'], row['_labels'], row['n']));
            });
        },

        /**
         * Trigger when a node is clicked on the graph.
         */
        onNodeExpand: function (_id) {
            // the node id..
            var _self = this, transactions = new Transactions();

            transactions.add("MATCH (a)-[r]->(b) WHERE ID(a) = "+ _id +" RETURN a, ID(a) AS _aid, labels(a) AS _alabels, r,  type(r) AS _rtype, b, ID(b) AS _bid, labels(b) AS _blabels");

            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    var sourceNode = Factory.createNode(row['_aid'], row['_alabels'], row['a']);
                    var targetNode = Factory.createNode(row['_bid'], row['_blabels'], row['b']);
                    var relationship = Factory.createRelationship(row['_rtype'], {}, sourceNode, targetNode);
                    graph.addLink(relationship);
                });
            });
        },

        /**
         * Triggered when the user adds a new node in create mode.
         */
        onNodeMerge: function (transactions) {
            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    // add id as property
                    var node = Factory.createNode(row['_id'], row['_labels'], row['n']);
                    graph.updateNode(node);
                });
            });
        },

        /**
         * Triggered when the graph has notified use that a node was to be created
         * we need to return that created node with a valid _id or false
         */
        onNodeCreatePromise: function (coordinates) {
            var _self = this;

            // create a new node using the factory with no _id, no _labels and no _properties
            var node = Factory.createNode(null, ["Hey","Joe"], {blugr:"kjq"});
            var transactions = NodeType.getTransactions(node);

            client.commit(transactions, function (resultSet) {
                var row = resultSet.getDataset()[0];
                // re-load the node from what is returned byt the create query and create a proper node just in case
                // (does not launch another MATCH query, just use the RETURN statement at the end of the CREATE statement :-))
                graph.addNode(Factory.createNode(row['_id'], row['_labels'], row['n']), true, coordinates);
                _self.onNodeClick(row['_id']);
                // and by the way open the modal to edit the node
                // now add it the the graph !:-)
            });
        },

        /**
         * Triggered when a dragline is successfully dragged between
         * two nodes to create a relationship from source node to target node.
         */
        onRelationshipCreatePromise: function (data) {
            var _self = this;

            var relationship = Factory.createRelationship('TEST_REL', {}, data.source, data.target);
            var transactions = RelationshipType.getTransactions(relationship);

            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    var sourceNode = Factory.createNode(row['_aid'], row['_alabels'], row['a']);
                    var targetNode = Factory.createNode(row['_bid'], row['_blabels'], row['b']);
                    var relationship = Factory.createRelationship(row['_rtype'], {}, sourceNode, targetNode);
                    graph.addLink(relationship);
                });
            });
        },

        /**
         * Load node edit form.
          * @param A node create with the Factory
         */
        createNodeEditForm: function (node) {
            var _self = this;

            NodeType.renderView('div#node-form', node, function (e) {
                e.preventDefault();
                _self.onNodeMerge(NodeType.getTransactions());
            });
        },

        /**
         * Load node edit form.
          * @param A node create with the Factory
         */
        createRelationshipEditForm: function (relationship) {
            var _self = this;

            RelationshipType.renderView('div#relationship-form', relationship, function (e) {
                e.preventDefault();
                _self.onRelationshipMerge(RelationshipType.getTransactions());
            });
        },
    };
});
