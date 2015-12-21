/**
 * Global config boostrapper.
 *
 * This module builds a map of all the bundles detected as "required" in html markup.
 * @namespace \framework\Config\GlobalConfig.js
 */
define(['framework/Component/Util'], function (Util) {
    'use strict';

    var globalConfig = {};
    var debugKernelBundles = {};

    /**
     * Default global config values here.
     * Can be overriden in bundles Configuration.js files
     */
    globalConfig.DefaultConfiguration = {
        debug: true,
    };

    // The config looks for "XxxBundle" properties in Require config paths object
    // and loads their own config file automatically to mimic dependency injection
    var globalBundles = [],
        paths = requirejs.s.contexts._.config.paths;

    // loop through declared pathes in boostrap.js
    var i = 0;
    for (var path in paths) {
        // test if the path looks like XxxBundle (which is a given convention)
        var regexp = new RegExp(/([a-z0-9]+)Bundle/i),
            matches = path.match(regexp);

        if(matches !== null) {
            globalBundles[i] = {
                name: matches[0],
                // configPath: '/js/' + paths[matches[0]] + '/DependencyInjection/Configuration.js',
                loaderPath: matches[0] + '/Controller/'+ matches[0].replace('Bundle', '') +'Controller',
                controllerPath: null,
            };
            i++;
        } else {
            continue;
        }
    }

    /**
     * Returns the current module
     */
    return {
        globalConfig:  globalConfig,
        globalBundles: globalBundles,

        /**
         * General getter form config object
         *
         * @param  {string} Namespace.property expression like XxxBundle.configitem
         * @return {mixed}  Any config value, string number array or object
         */
        item: function(expression, value) {
            //search in global config first
            var item = null;

            if (typeof value !== 'undefined') {
                // then we set the config value, not get it !
                this.globalConfig.DefaultConfiguration[expression] = value;
                return;
            }

            if (typeof this.globalConfig.DefaultConfiguration[expression] !== 'undefined') {
                item = this.globalConfig.DefaultConfiguration[expression];
            }

            // search item in bundle config after and override defautl configuration value
            var overridenValue = this._objPropFromConfigString(expression);
            if (overridenValue !== null) {
                item = overridenValue;
            }

            return item;
        },

        /**
         *
         */
        debug: function(message, type) {
            if (typeof type == 'undefined') {
                var type = 'info';
            }
            
            var color, prefix = type+':';
            switch (type) {
                case 'info':    color = '#474747'; break;
                case 'error':   color = '#E33C05'; break;
                case 'success': color = '#2B9E0B'; break;
                case 'warning': color = '#E38809'; break;
                default:        color = '#474747'; break;
            }

            if (this.globalConfig.DefaultConfiguration.debug !== true) {
                return;
            }

            console.log('%c' + prefix + ' ' + message, 'color:' + color);
        },

        /**
         * Loads each bundle config and adds them up to one big config object
         * proprietary of this config module
         *
         */
        autoloadConfigs: function(onReady) {
            var $this = this;
            var globalBundlesMap = Util.map(this.globalBundles, function(bundle){
                return bundle.configPath;
            });

            for (var i=0; i < globalBundlesMap.length; i++) {
                var configurationNamespace = globalBundles[i].name;
                globalConfig[configurationNamespace] = 'none';
            }

            // trigger AppKernel callback
            onReady(globalConfig);
        },

        /**
         * Reads s atring "object.property" and actually returns the object prop
         *
         * @param  {string} Namespace.property expression like XxxBundle.configitem
         * @return {mixed}  Any config value, string number array or object
         */
        _objPropFromConfigString: function(expression) {
            var parts = expression.split('.'),
                namespace = parts[0],
                property  = parts[1];

            // the namespace object has to be defined
            if (!this.globalConfig.hasOwnProperty(namespace)) {
                return null;
            }

            // and of course the object config property
            if (!this.globalConfig[namespace].hasOwnProperty(property)) {
                return null
            }

            return this.globalConfig[namespace][property];
        }

    };
});
