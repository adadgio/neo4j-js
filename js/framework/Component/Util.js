/**
 * @namespace framework\Component\
 * Set of objects and other maniulation utilities.
 */
define(function(){
    'use strict';

    return {

        /**
         * Computes an object size becaue javascript does not support obj.length
         * @param  {object}  Object for which you wish to count its properties
         * @return {integer} Number of properties of the object
         */
        objectSize: function(obj)
        {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },

        /**
         * Map a callback to an array.
         */
        map: function (array, callback) {
            var result = [];
            for (var i=0; i < array.length; i++) {
                result.push(callback(array[i]));
            }
            return result;
        },

        /**
         * Checks the needle is in the given array.
         */
        inArray: function (needle, haystack) {
            for (var i = 0; i < haystack.length; i++) {
                if (needle === haystack[i]) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Returns lower cased string including accents
         */
        ucfirst: function(str) {
            str = str.toLowerCase();
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

    };
});
