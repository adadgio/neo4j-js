/**
 * @namespace framework\Component\Neo4j
 */
define(function() {
'use strict';

    return {
        /**
         * Create a formatted Node object
         */
        createRelationship: function (_type, properties, sourceNode, targetNode) {
            return {
                _source: sourceNode,
                _target: targetNode,
                _type: _type,
                _properties: properties
            };
        },

        /**
         * @todo
         */
        createRelationshipFromFormData: function (formData) {
            // var node   = {
            //     _id: null,
            //     _labels: [],
            //     _properties: {},
            // };
            // var regexp = new RegExp(/([a-z_]+)\[([0-9]+)\]/);
            //
            // for (var i=0; i < formData.length; i++) {
            //     var prop = formData[i].name,
            //         val  = formData[i].value;
            //
            //     var matches = prop.match(regexp);
            //     if (null !== matches && matches[1] !== 'value') {
            //         // the its a property[n] or label[n]...
            //         var type  = matches[1], // "label|property"
            //             index = parseInt(matches[2]);
            //
            //         if (type === 'label') {
            //             node['_labels'].push(val);
            //         } else if (type === 'property') {
            //
            //             // its property[index], so find value[index] in formData
            //             for (var j=0; j < formData.length; j++) {
            //                 if (formData[j].name === 'value['+ index +']') {
            //                     node['_properties'][val] = formData[j].value;
            //                 }
            //             }
            //         }
            //     } else {
            //         if (prop === '_id') {
            //             node[prop] = parseInt(val);
            //         }
            //     }
            // }
            //
            // return node;
        },
    };
});
