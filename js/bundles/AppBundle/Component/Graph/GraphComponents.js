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
        createHandler: function (name, args) {
            if (name === 'trashCan') {
                return returnComponentTrashCan(args);
            }
        },
        
        /**
         * Return the trash can component
         */
        returnComponentTrashCan: function (svg) {
            var trashcan = svg
                    .append("g")
                    .attr("class", "gtrash");

            var trashcanRect = trashcan
                    .append("rect")
                    .attr("class", "trash")
                    .attr("transform", function () {
                        return "translate(" + (width - 80 - 4) + "," + (height - 60 - 4 ) + ")";
                    })
                    .attr("height", 60)    // set the height
                    .attr("width", 80)
                    .on("mouseover", function () {
                        if (currentlyDraggedElement) {
                            console.log(d3.select(currentlyDraggedElement));
                            d3.select(this).classed('hovered', true);
                        }
                    })
                    .on("mouseout", function () {
                        d3.select(this).classed('hovered', false);
                    });

            trashcan.append("text")
                    .attr("class", "trash-ico")
                    .attr("text-anchor", "middle")
                    .attr("transform", function () {
                        return "translate(" + (width - 80 - 4) + "," + (height - 60 - 4 ) + ")";
                    })
                    .attr("dy", "36px")
                    .attr("dx", "40px")
                    .attr("font-family", "FontAwesome")
                    .text("\uf1f8");

            ;
        },
    };
});
