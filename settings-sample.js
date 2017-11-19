Settings = {
    name: "Neo4j JS",
    client: {
        apiEndpoint: "http://127.0.0.1:7474/db/data",
        authBasic: "Basic qwerty==",
    },

    graph: {
        // _id: '_id',
        // _labels: '_labels',
        primaryLabel: 'name',
        // types: ['IS_RELATED', 'MY_RELATIONSHIP'],
        nodes: {
            _id: '_id',
            _labels: '_labels',
            labels: ['Truc', 'Machin', 'Person'],
            properties: {
                id: 'integer',
                name: 'string',
                other: 'string',
            },
        },
        labels: {
            types: [ 'Truc', 'Machin', 'Person' ],
            properties: {
                id: 'integer',
                name: 'string',
                other: 'string',
            },
            colors: {
                Truc:       'green',
                Machin:     'red',
                Person:     'violet',
            },
        },
        relationships: {
            types: [ 'IS_RELATED', 'MY_RELATIONSHIP' ],
            properties: {
                age: 'integer',
            }
        },
    },
    // colors: {
    //     Truc:       'green',
    //     Machin:     'red',
    //     Person:     'violet',
    // },
}
