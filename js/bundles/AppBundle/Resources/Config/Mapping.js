/**
 * Config mappings for neo4j fields
 */
define(function () {
'use strict';
    return {
        node: {
            _id: '_id',
            _labels: '_labels',
            labels: ['Truc','Machin','Person', 'Bidule'],
            properties: {
                id: 'integer',
                name: 'string',
                bidule: 'chouette',
            },
        },
        relationships: {
            types: ['MY_TYPE','NOT_MY_TYPE'],
            properties: {
                age: 'integer',
            }
        },
        graph: {
            _id: '_id',
            _labels: '_labels',
            primaryLabel: 'name',
        },
        colors: {
            Truc: 'green',
            Machin: 'red',
            Specialty: 'Orange',
            Person: 'violet',
            Page: 'green',
        },
    };
});
