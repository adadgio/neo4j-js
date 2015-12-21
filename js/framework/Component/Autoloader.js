/**
 * @namespace \framework\Component\Autoloader.js
 *
 * Autoloads controllers and modules via requireJS
 */
define(['framework/Config/GlobalConfig'], function(GlobalConfig){
    'use strict';

    return function(bundles) {
        return {

            loaders: [],
            bundles: bundles,
            // autoloadList: autoloadList,

            /**
             * From the autoloadList, build an array of modules to load.
             */
            init: function() {
                var loaders = [],
                    debugMode = GlobalConfig.item('debug');

                // only for debug mode but usefull to detect data-required attributes that
                // do not correspond to declared bundles in your AppKernel.js
                // look for missing declared bundles in AppKernel.js
                // when the data-require attribute is declared !
                var debugRequiredAttrs = [];
                if (debugMode === true) {
                    var requiredAttrs = $('div[data-require*="Bundle"],form[data-require*="Bundle"]');

                    for (var i = 0; i < requiredAttrs.length; i++) {
                        var okay = false,
                            name = $(requiredAttrs[i]).data('require');

                        // if bundle/controller name contains ":" (we require a controller)
                        var info            = this.getBundleAndControllerNames(name),
                            bundleName      = info.bundleName,
                            controllerName  = info.controllerName; // can be false

                        for (var j = 0; j < this.bundles.length; j++) {

                            if (this.bundles[j].name === bundleName) {
                                okay = true;
                                break;
                            }
                        }

                        if (false === okay) {
                            GlobalConfig.debug('Attr [data-require="'+ name +'"] detected but '+ name +' was not found in your AppKernel.js.', 'error');
                        }
                    }
                }

                // loop through declared bundles if the AppKernel.js and search for
                // corresponding data-require="BundleName" attributes
                for (var i = 0; i < this.bundles.length; i++) {
                    var namespace = this.bundles[i].name;

                    var required = $('div[data-require*="'+ namespace +'"],form[data-require*="'+ namespace +'"]');

                    if (required.length === 0) {
                        continue;
                    } else {
                        // GlobalConfig.debug('Attr [data-require="'+ namespace +'"] detected. '+ namespace +' will be loaded.', 'green');
                    }

                    for (var n=0; n < required.length; n++) {
                        // if bundle/controller namespace contains ":" (we require a controller)
                        var expName         = $(required[n]).attr('data-require'),
                            info            = this.getBundleAndControllerNames(expName),
                            bundleName      = info.bundleName,
                            controllerName  = info.controllerName; // can be false

                        var name = namespace + expName;
                        name = name.replace(":", "");
                        GlobalConfig.debug('Attr [data-require="'+ name +'"] detected. '+ name +' will be loaded.', 'success');

                        loaders[name] = {
                            id: this.bundles[i].id,
                            path: bundles[i].loaderPath,
                            namespace: namespace,
                            controller: info.bundleName + '/Controller/' + controllerName
                        };
                    }
                }

                this.loaders = loaders;
                return this;
            },

            /**
             *
             */
            getBundleAndControllerNames: function (name) {
                var bundleName      = false,
                    controllerName  = false,
                    parts           = name.split(':');

                if (parts.length === 1) {

                    bundleName      = parts[0];
                    controllerName  = false;

                } else if( parts.length === 2) {

                    bundleName      = parts[0];
                    controllerName  = parts[1];

                } else {
                    GlobalConfig.debug('Sorry, []' + name + '] bundle or controller are not properly called in the data-required attribute.');
                    return;
                }

                return {
                    bundleName: bundleName,
                    controllerName: controllerName
                };
            },

            /**
             * Returns all the autoload registered modules
             */
            getBundles: function() {
                return this.loaders;
            },

            /**
             * Tells you if the module name in input is in the list of modules to autoload
             * @depreciated
             */
            requires: function(name) {
                return ( typeof this.loaders[name] === 'object') ? this.loaders[name].require : false;
            },

            /**
             * @depreciated
             */
            getLoader: function(name) {
                return ( typeof this.loaders[name] === 'object') ? this.loaders[name] : false;
            },


            ie8: function(){} // avoid IE8 trailing comma bugs
        };
    };
});
