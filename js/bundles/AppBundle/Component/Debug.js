/**
 * Opens boostrap modal with a mustache template.
 */
define(function () {

    return {
        events: [],

        push: function(eventString) {
            this.events.push(eventString);
            this.show();
        },

        show: function () {
            $('div#debug').html(this.events.join("\n"));
        }
    };

});
