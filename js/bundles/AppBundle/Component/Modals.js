/**
 * Opens boostrap modal with a mustache template.
 */
define(['mustache'], function (Mustache) {

    var buttons = $('a[data-toggle="modal"],button[data-toggle="modal"]');

    return {
        bindAll: function (options) {

            $('div#modal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                // var recipient = button.data('whatever');
                var modal = $(this);
                var template = button.attr('data-template');

                $.get(template, function(template) {
                    var html = Mustache.render(template, {title: button.attr('title'), contents: "<strong>Luke</strong>"});
                    modal.html(html);
                    
                    // trigger the modal "*:load" event located int he modal-dialog markup
                    var eventName = $(html).attr('data-event');
                    modal.trigger(eventName, {modal: modal, button: this});

                    // trigger the modal "*:postSubmit" event
                    modal.find('button[data-validate="modal"]').bind('click', function (e) {
                        var eventName = $(this).attr('data-event');
                        modal.trigger(eventName, {modal: modal, button: this});
                    });
                });
            });
        }
    };

});
