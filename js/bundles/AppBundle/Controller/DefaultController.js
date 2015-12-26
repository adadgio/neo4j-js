/**
 * @namespace \bundles\AppBundle\Controller\
 */
define([
    'framework/Config/GlobalConfig',
    'framework/Component/File/FileSystem',
    'framework/Component/Listener/Listener',
], function (GlobalConfig, FileSystem, Listener) {
'use strict';

    return {
        /**
         * Filesystem instance
         */
        fs: null,

        /**
         * Constructor
         */
        init: function () {
            this.fs = new FileSystem();

            this.addEventListeners();
        },

        /**
         * Add all custom events listeners.
         */
        addEventListeners: function () {
            var _self = this;
            
            // Listener.on('config:open', function (element, event) {
            //     _self.fs.read('config.txt', function (data) {
            //         console.log(data);
            //     });
            // });
        },
    };
});
