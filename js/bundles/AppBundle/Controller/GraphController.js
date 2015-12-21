/**
 * @namespace \bundles\AppBundle\Controller\
 */
define([
    'framework/Component/Neo4j/Client',
    'framework/Component/Neo4j/Transactions',
    'framework/Component/Neo4j/NodeFactory',
    'framework/Component/Neo4j/RelationshipFactory',
    'bundles/AppBundle/Resources/Config/Mapping',
    'bundles/AppBundle/Component/Form/NodeType',
    'bundles/AppBundle/Component/Form/NodeSearchType',
    'bundles/AppBundle/Component/Graph/Graph',
], function (Neo4jClient, Transactions, NodeFactory, RelationshipFactory, Mapping, NodeType, NodeSearchType, Graph) {
'use strict';

    var graph = new Graph('svg#map');

    var client = new Neo4jClient({
        apiEndpoint: Mapping.client.apiEndpoint,
        authBasic:   Mapping.client.authBasic,
    });

    return {
        /**
         * Constructor
         */
        init: function () {
            // init graph
            graph.init();

            // bind the search node form
            NodeSearchType.bind();

            // bind event listeners
            this.addEventListeners();

            // @todo To remove later
            // NodeSearchType.submit();
        },

        /**
         * Add all custom events listeners.
         */
        addEventListeners: function () {
            var _self = this,
                modal = $('div#modal');

            graph.$.on('node:click', function (e, d) {
                _self.onNodeClick(d._id);
            });

            graph.$.on('node:dblclick', function (e, d) {
                _self.onNodeExpand(d._id);
            });

            graph.$.on('node:create:promise', function (e, coordinates) {
                _self.onNodeCreatePromise(coordinates);
            });

            NodeSearchType.getForm().on('node:search:submit', function (e, transactions) {
                _self.onNodeSearchPostSubmit(transactions);
            });
        },

        /**
         * Add several search resulsts nodes to the graph on search submit.
         */
        onNodeSearchPostSubmit: function (transactions) {
            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    graph.addNode(NodeFactory.createNode(row['_id'], row['_labels'], row['n']));
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
                _self.createEditForm(NodeFactory.createNode(row['_id'], row['_labels'], row['n']));
            });
        },

        /**
         * Trigger when a node is clicked on the graph.
         */
        onNodeExpand: function (_id) {
            // the node id..
            var _self = this, transactions = new Transactions();

            transactions.add("MATCH (a)-[r]-(b) WHERE ID(a) = "+ _id +" RETURN a, ID(a) AS _aid, labels(a) AS _alabels, r,  type(r) AS _rtype, b, ID(b) AS _bid, labels(b) AS _blabels");

            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    var sourceNode = NodeFactory.createNode(row['_aid'], row['_alabels'], row['a']);
                    var targetNode = NodeFactory.createNode(row['_bid'], row['_blabels'], row['b']);
                    var relationship = RelationshipFactory.createRelationship(row['_rtype'], {}, sourceNode, targetNode);
                    graph.addLink(relationship);
                });
            });
        },

        /**
         * Triggered when the user searches some nodes in the graph
         * and places node results sets on the svg graph.
         */
        onNodeMerge: function (transactions) {
            client.commit(transactions, function (resultSet) {
                resultSet.each(function (row) {
                    // add id as property
                    var node = NodeFactory.createNode(row['_id'], row['_labels'], row['n']);
                    graph.updateNode(node);
                });
            });
        },

        /**
         * Trigger when the graph has notified use that a node was to be created
         * we need to return that created node with a valid _id or false
         */
        onNodeCreatePromise: function (coordinates) {
            var _self = this;

            // create a new node using the factory with no _id, no _labels and no _properties
            var node = NodeFactory.createNode(null, ["Hey","Joe"], {blugr:"kjq"});
            var transactions = NodeType.getTransactions(node);

            client.commit(transactions, function (resultSet) {
                var row = resultSet.getDataset()[0];
                // re-load the node from what is returned byt the create query and create a proper node just in case
                // (does not launch another MATCH query, just use the RETURN statement at the end of the CREATE statement :-))
                graph.addNode(NodeFactory.createNode(row['_id'], row['_labels'], row['n']), true, coordinates);
                _self.onNodeClick(row['_id']);
                // and by the way open the modal to edit the node
                // now add it the the graph !:-)
            });
        },


        /**
         * Load node edit form.
          * @param A node create with the NodeFactory
         */
        createEditForm: function (node) {
            var _self = this;

            NodeType.renderView('div#node-form', node, function (e) {
                e.preventDefault();
                _self.onNodeMerge(NodeType.getTransactions());
            });
        },
    };
});
