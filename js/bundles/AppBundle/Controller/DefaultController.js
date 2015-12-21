/**
 * @namespace \bundles\AppBundle\Controller\
 */
define([
    'framework/Config/GlobalConfig',
    'framework/Component/Neo4j/Client',
    'framework/Component/Neo4j/Transactions',
], function (GlobalConfig, Neo4jClient, Transactions) {
'use strict';

    var client = new Neo4jClient({
        apiEndpoint: "http://127.0.0.1:7474/db/data",
        authBasic:   "Basic bmVvNGo6ZnJlbmNoZnJvZw==",
    });

    return {
        /**
         * Constructor
         */
        init: function () {

            var transactions = new Transactions();
            // transactions.add("MATCH (a:Specialty), (p:Page) RETURN a, p.id, p.name LIMIT 2");
            // transactions.add("MATCH (a:Specialty), (p:Page) RETURN a, p.id, p.name LIMIT 2");
            transactions.add("CREATE (n:Truc {name:'Machin'}) RETURN n");
            // transactions.add("MATCH (n:Specialty {name:'Machin'}) CREATE b");
            // client.commit(transactions, function (resultA, resultB) {
            //     resultA.each(function (row) {
            //         // console.log(row);
            //         // console.log(row["a"]);
            //         // console.log(row["a"].getProp("id"));
            //         // console.log(row["p.id"]);
            //     });
            // });

            this.addEventListeners();

            $('a[data-toggle="tooltip"]').tooltip();
        },

        /**
         * Add all custom events listeners.
         */
        addEventListeners: function () {

        },
    };
});
