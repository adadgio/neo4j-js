/**
 * Graph components (for clearer code)
 */
define(['bundles/AppBundle/Component/Graph/GraphComponents',], function (GraphComponents) {
'use strict';
    var mouseTimer = false;

    return {
        /**
         * Tolerance to determine a link or short click
         */
        mouseDownUpTolerance: 150,

        /**
         * Happens on key up
         */
        windowOnKeyUp: function (e, _g) {
            _g.state.currentKeyPressed = false;

            // fix all nodes
            // @todo To keep what the user as dragged as fixed, select here only nodes that do not have the class "fixed" (easy)
            _g.svg.selectAll('.gnode').classed('fixed', function (d) {  d.fixed = false; return false; });
        },

        /**
         * Happens on key pressed
         */
        windowOnKeyDown: function (e, _g) {
            if(d3.event.keyCode === 68) {
                _g.state.currentKeyPressed = 'D'; // the "d" fro drag key was pressed

                // enable drag events in that case ! :-)
                _g.svg.selectAll('.gnode').classed('fixed', function (d) {  d.fixed = true; return true; });

                // stop dragging capability, instead use dragging to create links ! :-)
            }
        },

        draggingMode: function () {

        },

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

            console.log(d3.event.target);

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

            // dragline. on mouse down the dragline has a start position
            // _g.components.dragline
            //     .attr('d', );
        },

        /**
         * Only happend in create mode
         */
        onGraphRelationshipDragstart: function(d, _g) {
            if (!_g.state.create) { return; }
            if (_g.components.dragline !== false) { return; } //cant have two draglines
            // make dragline start at node (d) position
            // check the "d" is a node (its the event target)

            if (typeof(d._id) == 'undefined' || parseInt(d._id) === 0) {
                // console.log(d3.event.target);
                return;
            }

            _g.components.dragline = GraphComponents.create('Dragline', _g);

            _g.components.dragline
                .attr('x1', d.x)
                .attr('y1', d.y)
                .attr('data-source', parseInt(d._id));

            _g.components.dragline.beeingDragged = true;

            return;
        },

        /**
         * Only happend in create mode
         */
        onGraphRelationshipMouseUp: function(_g) {
            if (!_g.state.create) { return; }
            if (!_g.components.dragline) { return; }

            var element = d3.event.target;
            var tagname = $(element).prop('tagName');
            
            console.log(tagname);
            if (tagname !== 'circle') {
                _g.components.dragline.remove();
                _g.components.dragline = false;
                return;
            }

            var _sourceId  = parseInt(_g.components.dragline.attr('data-source'));
            var _targetId = parseInt($(element).attr('data-id')); //this it the node target id !:-)
            console.log('@todo Add relationship from ' + _sourceId + ' to ' + _targetId);

            // remove the dragline...
            _g.components.dragline.remove();
            _g.components.dragline = false;
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
