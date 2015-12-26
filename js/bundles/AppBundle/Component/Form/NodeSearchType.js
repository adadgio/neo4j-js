/**
 * NodeSearcType form
 */
define([
    'framework/Component/Neo4j/Transactions',
    'framework/Component/Neo4j/SimpleQueryLanguage',
], function (Transactions, SimpleQueryLanguage) {
'use strict';

    // templates
    var form  = 'form#node-search',
        input = 'form#node-search input[name="s"]';

    return {
        bind: function (options) {
            var _self = this;

            $(form).unbind('submit').bind('submit', {self:this}, function (e){
                e.preventDefault();

                // count number of properties
                var text = $(input).val();
                _self.search(text);
            });

            // typeahead binding
            $(input).typeahead({
                autoSelect: true,
                multiple: true,
                source: [
                    {
                        id:     ":Person",
                        name:   ":Person",
                    }, {
                        id:     ":Specialty",
                        name:   ":Page",
                    }, {
                        id: "name=",
                        name: "name=",
                    }
                ]
            });
        },

        /**
         * Get the current form. Useful to retrive form events
         */
        getForm: function () {
            return $(form);
        },

        /**
         * Sets focus on form main input
         */
        setFocus: function () {
            $(input).val(':Person').focus();
        },

        /**
         * Dispatch the search event when the form is submitted.
         */
        search: function (text) {
            // create query string from SimpleQueryLanguage
            var queryString = SimpleQueryLanguage.translate(text);

            var transactions = new Transactions();
            transactions.add(queryString, {});

            $(form).trigger('node:search:submit', [transactions]);

            return this;
        },

        /**
         * Submit the form.
         */
        submit: function () {
            $(form).trigger('submit');
            return this;
        },

        /**
         * Get the Neo4j statement from the data transormer.
         */
        getTransactions: function () {

        }
    };

});
