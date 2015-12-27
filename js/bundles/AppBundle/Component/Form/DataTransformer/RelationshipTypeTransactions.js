/**
 * Deduces which transactions to make from the NodeType form
 */
define([
    'framework/Component/Neo4j/Transactions',
], function (Transactions) {

    return {
        /**
         * Transform NodeType form into cypher ready transaction query.
         * @param array   Node from the Neo4j\Factory
         * @return object Neo4jStatement
         */
        getTransactions: function (relationship) {
            var query = this.buildCreateQuery(relationship);

            // create the statement in transactions
            var transactions = new Transactions();
            transactions.add(query.query, query.params);

            return transactions;
        },

        /**
         * Creates a create query string and parameters
         * @todo Create the node with the _labels and _properties if provided
         */
        buildCreateQuery: function (relationship) {
            var params = {props: {}};

            var aid = parseInt(relationship._source.node._id), bid = parseInt(relationship._target.node._id);
            var query = "MATCH (a) MATCH(b) WHERE ID(a) = "+ aid +" AND ID(b) = "+ bid;

            query += " CREATE UNIQUE (a)-[r:"+ relationship._type +"]->(b)"
            query += " RETURN ID(a) AS _aid, ID(b) AS _bid, type(r) AS _rtype, labels(a) AS _alabels, labels(b) AS _blabels";

            return {
                query:  query,
                params: params,
            };
        },
    };

});
