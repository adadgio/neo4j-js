/**
 * @namespace \bundles\AppBundle\Component\Options
 */
define(['framework/Component/Util'], function(Util) {
'use strict';

    return function () {

        return {
            defaultOptions: {},
            requiredOptions: [],

            /**
             * Resolves all the option
             */
            resolve: function (options) {
                // check required options
                var resolvedOptions  = {};

                resolvedOptions = this.resolveRequiredOptions(options);
                resolvedOptions = this.resolveDefaultOptions(options);

                return resolvedOptions;
            },

            /**
             * Sets default options.
             */
            setDefaults: function (options) {
                this.defaultOptions = options;

                return this;
            },

            /**
             * Set required options
             */
            setRequired: function (options) {
                this.requiredOptions = options;
                return this;
            },

            /**
             * Test if required options are here or throw an error.
             */
            resolveRequiredOptions: function (options) {
                if (typeof options !== 'object') {
                    throw new Error('Options must be an object');
                }
                var inputOptionsKeys = Object.keys(options);

                // check that every required options is provided
                for (var i=0; i < this.requiredOptions.length; i++) {
                    if (Util.inArray(this.requiredOptions[i], inputOptionsKeys) < 0) {
                        throw new Error('OptionsResolver "'+ this.requiredOptions[i] +'" option is required');
                    }
                }

                return options;
            },

            /**
             * Test if input options are allowed or throw an error.
             */
            resolveDefaultOptions: function (options) {
                // test options keys
                var resolvedOptions    = {},
                    defaultOptionsKeys = Object.keys(this.defaultOptions),
                    inputOptionsKeys   = Object.keys(options);

                // check that no more suplementary options exist
                for (var i=0; i < inputOptionsKeys.length; i++) {
                    if (Util.inArray(inputOptionsKeys[i], defaultOptionsKeys) < 0) {
                        throw new Error('OptionsResolver default option "'+ inputOptionsKeys[i] +'" does not exist');
                    }
                }

                // set default options if they do not exist
                for (var i=0; i < defaultOptionsKeys.length; i++) {
                    var index = defaultOptionsKeys[i];
                    if (typeof(options[index]) !== 'undefined') {
                        resolvedOptions[index] = options[index];
                    } else {
                        resolvedOptions[index] = this.defaultOptions[index];
                    }
                }

                return resolvedOptions;
            },

            /**
             * Test the option value is allowed.
             * @todo
             */
            resolveDisallowedTypes: function (options) {

            },

        };
    };
});
