/**
 * Graph components (for clearer code)
 */
define(function () {
'use strict';

    return {
        /**
         * Calculates a distance between two nodes
         */
        distance: function (a, b) {
            return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
        },

        /**
         * Calculates a distance between two nodes
         */
        tick: function (node, link) {
            node.attr("transform", function (d) {
               return 'translate(' + [d.x, d.y] + ')';
            });

            link
                // .attr("x1", function(d) { return d.source.x; })
                // .attr("y1", function(d) { return d.source.y; })
                .attr("x1", function(d) {
                    var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                    return d.source.x + Math.cos(angle) * (20);
                })
                .attr("y1", function(d) {
                    var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                    return d.source.y + Math.sin(angle) * (20);
                })
                // .attr("x2", function(d) { return d.target.x; })
                //.attr("y2", function(d) { return d.target.y; })
                .attr("x2", function(d) {
                    var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                    return d.target.x - Math.cos(angle) * (20 + 4);
                })
                .attr("y2", function(d) {
                    var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                    return d.target.y - Math.sin(angle) * (20 + 4);
                });
        },
    };
});
