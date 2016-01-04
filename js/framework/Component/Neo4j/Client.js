/**
 * The base Neo4j client.
 * @namespace framework\Component\Neo4j
 */
define(['framework/Component/Neo4j/ResultSet', 'framework/Config/GlobalConfig'], function (ResultSet, GlobalConfig) {
'use strict';

    return function (options) {
        // setup all Ajax calls here to user authentication
        $.ajaxSetup({
            headers: { "Authorization": options.authBasic }
        });

        return {

            /**
             * Executes several remove cypher queries through transaction(s).
             * @param array Statements as cypher queries
             * @param function Callback function
             */
            commit: function (transactions, callback, error) {
                var _self = this,
                    data  = JSON.stringify(transactions.getStatements());

                $.ajax({
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    url: options.apiEndpoint + "/transaction/commit",
                    accepts: "application/json; charset=UTF-8",
                    data: data,
                    success: function(response) {
                        // pass the callback argument, not as array, but one by one
                        callback.apply(null, _self.handleTransactionsResults(response));
                    },
                    error: function(x,t,e){
                        if (typeof(error) === 'function') {
                            error('An error occured while executing the request');
                        }
                    }
                });
            },

            /**
             * Handle transaction results to put them into results sets or throw errors.
             */
            handleTransactionsResults: function (response) {
                var resultsSets = [];
                for (var i=0; i < response.results.length; i++) {
                    resultsSets.push(new ResultSet(response.results[i]));
                }

                // handle errors if necessary
                for (var i = 0; i < response.errors.length; i++) {
                    GlobalConfig.debug(response.errors[i].code + ' >>> ' + response.errors[i].message, 'error');
                    resultsSets.push(new ResultSet({columns:[], data:[]})); // fake empty result set
                }

                return resultsSets;
            },

        };
    }
});
