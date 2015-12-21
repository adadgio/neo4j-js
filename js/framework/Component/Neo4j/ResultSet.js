/**
 * @namespace framework\Component\Neo4j
 */
define(['framework/Component/Neo4j/Row'], function(Row, GlobalConfig) {
'use strict';

    return function (transactionResults, transactionErrors) {
        var _self = {};

        var dataset = createResultSet(transactionResults);

        /**
         * Private function to analyse the results.
         */
        function createResultSet (result) {
            var dataset = [];

            for (var i=0; i < result.data.length; i++) {
                dataset[i] = {};

                // get ech row (RETURN a,b | a.id, b.id) into a result[i] named property
                for (var j=0; j < result.columns.length; j++) {
                    var col = result.columns[j];

                    if (typeof(result.data[i].row[j]) === 'object') {
                        dataset[i][col] = new Row(result.data[i].row[j]);
                    } else {
                        dataset[i][col] = result.data[i].row[j];
                    }
                }
            }

            return dataset;
        }

        /**
         * Still leave a property accessible..
         */
        _self.dataset = dataset;

        /**
         * Set own results property
         */
        _self.getDataset = function () {
            return dataset;
        },

        /**
         * Get results
         */
        _self.each = function (callback) {
            for (var i=0; i < dataset.length; i++) {
                callback(dataset[i]);
            }
        };

        return _self;
    }
});
