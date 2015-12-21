/**
 * Graph components (for clearer code)
 */
define(function () {
'use strict';
    var mouseTimer = false;

    return {
        /**
         * Tolerance to determine a link or short click
         */
        mouseDownUpTolerance: 150,

        /**
         * Happens when mouse id pressed on the svg graph
         */
        graphOnMouseUp: function (_g, mouse) {
            if (!_g.state.create) { return; }

            // clear the mouse down/up interval
            clearInterval(mouseTimer);
            // reset cursor styles (new transition cancels the other one)
            this.resetCursorStyle(_g.components.cursor);
        },

        /**
         * Happens when mouse id realease on the svg graph
         */
        graphOnMouseDown: function (_g, mouse) {
            if (!_g.state.create) { return; }

            var $this = this,
                clock = 0;
            var coordinates = {x: mouse[0], y: mouse[1]};

            // start css transition effect on the cursor
            _g.components.cursor
                .transition().delay(2).duration(500)
                .attr('r', 15)
                .style('stroke', '#F2F2DC')
                .style('stroke-width', '3px');
                
            // start a timer
            mouseTimer = setInterval(function() {
                if (clock >= $this.mouseDownUpTolerance) {
                    clearInterval(mouseTimer);
                    $this.resetCursorStyle(_g.components.cursor);
                    $(_g.selector).trigger('node:create:promise', coordinates);
                    return;
                }
                clock++;
            }, 1);
        },

        /**
         * Resets the _g.components.cursor styles
         * Remember cursor is false (and not an element) when create mode is deactivated
         */
        resetCursorStyle: function (cursor) {
            if (cursor) {
                cursor.transition().style('stroke', '#ABB1BB').style('stroke-width', '1.4px').attr('r', 30);
            }
        }
    };
});
