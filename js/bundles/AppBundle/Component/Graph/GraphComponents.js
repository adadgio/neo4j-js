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
            var dragline = _g.svg.append('svg:path')
                .attr('class', 'dragline')
                .attr('transform', "translate(100,100)")
                .attr('d', 'M22,0L0,0');

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
