/**
 * Main entry point. Add a reference to this in your main index file.
 * @namespace \
 */
'use strict';
require.config({
    // enforceDefine: true, // helps prevent IE8 unwanted behavior, but not sure...
    urlArgs: 'v=' + (new Date()).getTime(), // helps refreshing assets loader during development
    paths: {
        jquery   : "lib/jquery-1.11.2.min",
        jqueryext: "lib/jquery-extensions/jquery-ext",
        bootstrap: "lib/bootstrap.min",
        typeahead: "lib/bootstrap3-typeahead.min",
        mustache:  "lib/handlebars-v4.0.5",
        text:      "lib/require-txt",
        d3js:      "lib/d3.v3",
        /* Your bundles here | contain minimum 2 letters */
        AppBundle:  "bundles/AppBundle",
    },
    shim: {
        "jqueryext": { "deps": ["jquery"] },
        "bootstrap": { "deps": ["jqueryext", "typeahead"] },
    },
});

/**
 * Wrap everything inside jQuery, other deps and GlobalConfig
 */
require(["bootstrap", "framework/Config/GlobalConfig", "framework/Component/Autoloader"], function($, GlobalConfig, Autoloader) {
    /**
     * Autoloads all config(s) from detected bundles.
     * The config(s) are injected as dependencies.
     */
    GlobalConfig.autoloadConfigs(function () {
        // set debug mode (shows console log and throw more error). Avoid in production.
        GlobalConfig.item('debug', true);
        // Hey man: thats practical, you can now load some config from any bundle with:
        // var myConfigVal = GlobalConfig.item('debug');

        // thanks to the framework autoloader, define a list of possible names (arbitrary)
        // that might correspond to a div [data-require="name"]. If found, the Autoloader.js
        var myAutoloader = new Autoloader(GlobalConfig.globalBundles).init();

        /**
         * Load bundles init(s) here
         */
        for ( var i in myAutoloader.getBundles()) {
            // var bundleRelativePath = myAutoloader.getBundles()[i].path;
            // bundle path can be the default BundlenameController or a special controller specified
            var controllerPath = (false === myAutoloader.getBundles()[i].controller) ? myAutoloader.getBundles()[i].path : myAutoloader.getBundles()[i].controller;
            require([controllerPath], function(Controller) {
                Controller.init();
            });
        }

        /* End of my bundles ! */
    });

});

/** #################### Fixes and custom functions  #################### **/
// @todo Should not be here
/**
 * Fixes Console log issue with IE8
 */
if (!window.console){ console = { log: function() {} } };
