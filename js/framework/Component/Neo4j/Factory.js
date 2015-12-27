/**
 * @namespace framework\Component\Neo4j
 */
define(function() {
'use strict';

    return {
        /**
         * Create a formatted Node object that d3js can use.
         */
        createNode: function (_id, _labels, properties) {
            if (_id === false || _id === null || parseInt(_id) === 0) {
                _id = false;
            } else {
                _id = parseInt(_id);
            }

            var scalarProperties = {};

            for (var prop in properties) {
                if (properties.hasOwnProperty(prop) && typeof(properties[prop]) !== 'function') {
                    scalarProperties[prop] = properties[prop];
                }
            }

            var arrayLabels = [];
            for (var index in _labels) {
                if (_labels.hasOwnProperty(index) && typeof(_labels[index]) === 'string') {
                    arrayLabels.push(_labels[index]);
                }
            }

            return {
                _id: _id,
                _labels: arrayLabels,
                _properties: scalarProperties,
            };
        },

        /**
         * Create a formatted Node object that d3js can use.
         */
        createNodeFromFormData: function (formData) {
            var node   = {
                _id: null,
                _labels: [],
                _properties: {},
            };
            var regexp = new RegExp(/([a-z_]+)\[([0-9]+)\]/);

            for (var i=0; i < formData.length; i++) {
                var prop = formData[i].name,
                    val  = formData[i].value;

                var matches = prop.match(regexp);
                if (null !== matches && matches[1] !== 'value') {
                    // the its a property[n] or label[n]...
                    var type  = matches[1], // "label|property"
                        index = parseInt(matches[2]);

                    if (type === 'label') {
                        node['_labels'].push(val);
                    } else if (type === 'property') {

                        // its property[index], so find value[index] in formData
                        for (var j=0; j < formData.length; j++) {
                            if (formData[j].name === 'value['+ index +']') {
                                node['_properties'][val] = formData[j].value;
                            }
                        }
                    }
                } else {
                    if (prop === '_id') {
                        node[prop] = parseInt(val);
                    }
                }
            }

            return node;
        },

        /**
         * @todo
         */
        createRelationshipFromFormData: function (relationship)
        {
                
        },

        /**
         * Creates a relationship object that d3js can use.
         * @todo Allow sourceNode and targetId to be node objects from the Factory.
         */
        createRelationship: function (_type, properties, sourceNode, targetNode) {
            if (typeof(_type) === 'undefined' || _type === null || _type === false || _type === '') {
                throw new Error('Factory::createRelationship() You cannot create an empty typed relationship');
            }

            return {
                _source: sourceNode,
                _target: targetNode,
                _type: _type,
                _properties: properties
            };
        },
    };
});
