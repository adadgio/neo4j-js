/**
 * Config mappings for neo4j fields
 */
define(function () {
'use strict';
    return {
        client: {
            apiEndpoint: "http://127.0.0.1:7474/db/data",
            authBasic:   "Basic bmVvNGo6ZnJlbmNoZnJvZw==",
        },
        node: {
            _id: '_id',
            _labels: '_labels',
            labels: ['Specialty', 'Page', 'Profesion', 'Document'],
            properties: {
                id: 'integer',
                name: 'string',
                other: 'string',
            },
        },
        relationships: {
            types: ['IS_RELATED','AD_TARGETS', 'IS_CHILD', 'LINKED_WITH'],
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
            Truc:       'green',
            Machin:     'red',
            Specialty:  'orange',
            Person:     'violet',
            Page:       'green',
            Document:   'gray',
        },
    };
});
