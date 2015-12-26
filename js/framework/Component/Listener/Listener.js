/**
 * Easiest click listener using data-* elements
 */
define(function () {
    return {
        /**
         * Create an event listener.
         */
        on: function (eventType, listenerCallback, eventName) {
            if (typeof(eventName) === 'undefined') {
                var eventName = 'click';
            }

            $('[data-event="'+ eventType +'"]').unbind('click').bind('click', function (e) {
                e.preventDefault();

                // register a function on the elment to get other data attributes
                this.data = function (dataAttr) {
                    return $(this).attr('data-' + dataAttr);
                };

                listenerCallback(this, e);
            });
        }
    };
});
