/**
 * @namespace framework\Component\Neo4j
 */
define(function() {
'use strict';

    return function (data) {
        var row = {};
        
        // if data is an object (RETURN a), then row becomes and object
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) { row[prop] = data[prop]; }
        }

        /**
         * Get row property (either full node n, or node property)
         */
        row.getProp = function () {
            return data.hasOwnProperty(prop) ? data[prop] : null;
        };

        /**
         * Set a property but...
         */
        row.setProp = function () {

        };

        return row;
    }
});
