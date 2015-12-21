/**
 * @namespace \bundles\AppBundle\Controller\
 */
define(function (Greeting) {

    return function (selector) {
        return {
            /**
             * A method to say hello (or anything) to the world
             */
            say: function (word) {
                $(selector).text(word);
            }
        };
    };
});
