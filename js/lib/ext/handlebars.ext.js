/**
 *`Handlebars extensions
 * Handlebars is available because its a dependency (see shim config)
 */
define(["handlebars"], function (Handlebars) {
'use strict';

    Handlebars.registerHelper('ifCond', function(a, b, options) {
        if(a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('ifIn', function(elem, list, options) {
        if (list.indexOf(elem) > -1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    
    return Handlebars;
});
