/**
 * The base Neo4j client.
 * @namespace framework\Component\Neo4j
 */
define(function() {
'use strict';

    return function (query, parameters) {
        return {
            statements: {
                "statements": []
            },

            /**
             * Add a statement to the list
             */
            add: function (query, parameters) {
                this.statements["statements"].push({
                    "statement": query,
                    "parameters": parameters,
                });

                return this;
            },

            /**
             * Get prepared statement ready to be send to a
             * transactional endpoint.
             */
            getStatements: function () {
                return this.statements;
            }
        };
    }
});
