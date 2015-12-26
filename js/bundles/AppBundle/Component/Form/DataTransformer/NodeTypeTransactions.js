/**
 * Deduces which transactions to make from the NodeType form
 */
define([
    'framework/Component/Neo4j/Transactions',
], function (Transactions) {

    return {
        /**
         * Transform NodeType form into cypher ready transaction query.
         * @param array   Node from the NodeFactory
         * @return object Neo4jStatement
         */
        getTransactions: function (node) {
            if (node._id === false || node._id === null) {
                var query = this.buildCreateQuery(node);
            } else {
                var query = this.buildUpdateQuery(node);
            }

            // create the statement in transactions
            var transactions = new Transactions();
            transactions.add(query.query, query.params);

            return transactions;
        },

        /**
         * Creates a create query string and parameters
         * @todo Create the node with the _labels and _properties if provided
         */
        buildCreateQuery: function (node) {
            var params = {props: {}};
            var query = "CREATE (n";

            // add labels if provided
            if (node._labels.length > 0) {
                query += ":" + node._labels.join(':');
            }

            query += ")";

            // set normal properties
            if (Object.keys(node._properties).length > 0) {
                params.props = node._properties;
                query += " SET n = {props}";
            }

            query += " RETURN n, ID(n) AS _id, labels(n) AS _labels";

            return {
                query:  query,
                params: params,
            };
        },

        /**
         * Creates a match query string and parameters
         */
        buildUpdateQuery: function (node) {
            var params = {props: {}};
            var query = "MATCH (n) WHERE ID(n) = " + parseInt(node._id);

            // delete and reset labels (first remove ALL label from the node, there is no ither way)
            query += " REMOVE n:" + Settings.graph.label.types.join(':');
            if (node._labels.length > 0) {
                query += " SET n:" + node._labels.join(':');
            }

            // set normal properties
            if (Object.keys(node._properties).length > 0) {
                params.props = node._properties;
                if (node._labels.length > 0) {
                    query += ", n = {props}";
                } else {
                    query += " SET n = {props}";
                }
            }

            query += " RETURN n, ID(n) AS _id, labels(n) AS _labels";

            return {
                query:  query,
                params: params,
            };
        },
    };

});
