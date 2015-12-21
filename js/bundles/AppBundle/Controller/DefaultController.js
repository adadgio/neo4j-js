/**
 * @namespace \bundles\AppBundle\Controller\
 */
define([
    'framework/Config/GlobalConfig',
], function (GlobalConfig) {
'use strict';
    
    return {
        /**
         * Constructor
         */
        init: function () {

            $('a[data-toggle="tooltip"]').tooltip();

            this.addEventListeners();
        },

        /**
         * Add all custom events listeners.
         */
        addEventListeners: function () {

        },
    };
});
