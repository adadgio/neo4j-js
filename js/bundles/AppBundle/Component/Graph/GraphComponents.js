/**
 * Graph components (for clearer code)
 */
define(function () {
'use strict';

    return {
        /**
         * Created/registered components list.
         */
        handlers: {},

        /**
         * Creates a component
         */
        create: function (name, args) {
            var func = 'create' + name;

            if (typeof(this[func]) === 'function') {
                return this[func].call(this, args);
            }
        },

        /**
         * Creates the hidden drag line when linking two nodes
         */
        createDragline: function (_g) {
            // line displayed when dragging new nodes
            var dragline = _g.svg.append("line")
                .attr("x1", 5)
                .attr("y1", 5)
                .attr("x2", 5)
                .attr("y2", 5);
            // var dragline = _g.svg.append('svg:path')
            //     .attr('class', 'dragline')
            //     .attr('transform', "translate(100,100)")
            //     .attr('d', 'M22,0L0,0');

            dragline.hide = function () {
                this.classed('hidden', true);
            }
            dragline.show = function () {
                this.classed('hidden', false);
            }

            return dragline;
        },

        /**
         * Creates the hidden drag line when linking two nodes
         */
        createCursor: function (_g) {
            // line displayed when dragging new nodes
            var cursor = _g.svg.append("circle")
                .attr("r", 30)
                .attr("id", "cursor")
                .attr("transform", "translate(-100,-100)")
                .attr("class", "cursor");

            return cursor;
        },

        /**
         *
         */
        createArrowMarker: function (_g) {
            var marker = _g.svg.append("defs").append("marker")
                .attr("id", "arrow-marker")
                .attr("class", "arrow-marker")
                .attr("viewBox", "0 0 10 10")
                .attr("refX", 0)
                .attr("refY", 5)
                .attr("markerWidth", 4)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M 0 0 L 10 5 L 0 10 z");

            return marker;
        },

        /**
         * Return the trash can component
         */
        createTrashcan: function (_g) {
            var g = _g.svg.append('g');

            var rect = g.append('rect')
                .attr('class', 'trasharea')
                .attr('transform', function () {
                    return 'translate(' + (width - 80 - 4) + ',' + (height - 60 - 4 ) + ')';
                })
                .attr('height', 60)    // set the height
                .attr('width', 80)
                .on('mouseover', function () {
                    // if (currentlyDraggedElement) {
                    //     d3.select(this).classed('active', true);
                    // }
                })
                .on('mouseout', function () {
                    d3.select(this).classed('active', false);
                });

            g.append('text')
                    .attr('class', 'trashico')
                    .attr('text-anchor', 'middle')
                    .attr('transform', function () {
                        return 'translate(' + (width - 80 - 4) + ',' + (height - 60 - 4 ) + ')';
                    })
                    .attr('dy', '36px')
                    .attr('dx', '40px')
                    .attr('font-family', 'FontAwesome')
                    .text('\uf1f8');

            ;
        },
    };
});
