/**
 * @namespace bundles/AppBundle/Component/Graph
 */
define([
    'd3js',
    'framework/Component/Neo4j/Factory', // not used here
    'bundles/AppBundle/Component/Graph/GraphComponents',
    'bundles/AppBundle/Component/Graph/GraphHandlers',
    'bundles/AppBundle/Component/Graph/GraphUtilities',
], function (d3, Factory, GraphComponents, GraphHandlers, GraphUtilities) {
'use strict';

    return function (selector) {
        var _self = {};

        var _g = {
            svg:        null,
            force:      null,
            nodes:      [], // force.nodes()
            links:      [], // force.links()
            link:       null, //svg.selectAll(".link"),
            node:       null, //svg.selectAll(".node", function (d) { return d._id; })
            gnode:      null, // svg.selectAll(".gnode");
            width:      $(selector).outerWidth(),
            height:     $(selector).outerHeight(),
            selector:   selector,
            components: {
                cursor:   false,
                dragline: false,
            },
            events: {
                memory: {},
                dragPosition:{x: 0, y: 0},
            },
            state: {
                create:         false,
                dragging:       true,
                draggedElement: false,
                preventDrag:    false,
                currentKeyPressed: false,
            },
            tick: function () {
                GraphUtilities.tick(_g.node, _g.link);
            },
        };

        /**
         * Declare all important master graph elements
         */
        d3.select(window)
            .on('keyup', function (e) { GraphHandlers.windowOnKeyUp(e, _g); })
            .on('keydown', function (e) { GraphHandlers.windowOnKeyDown(e, _g); });

        _g.svg = d3.select(selector)
            .on('mouseup', function (e) {
                GraphHandlers.graphOnMouseUp(_g, d3.mouse(this));
                // check if in create mode: when a dragline is mouseupped
                var createRelationship = GraphHandlers.onGraphRelationshipMouseUpCreate(_g);
                if (createRelationship) {
                    $(_g.selector).trigger('relationship:create:promise', [{source: createRelationship.source, target: createRelationship.target}]);
                }
            })
            .on('mousedown', function () {
                GraphHandlers.graphOnMouseDown(_g, d3.mouse(this));
            })
            .on('mousemove', function () {
                _g.events.dragPosition.x = d3.mouse(this)[0];
                _g.events.dragPosition.y = d3.mouse(this)[1];

                // reposition dragline
                var mouse = d3.mouse(this);
                var coords = {x: mouse[0] - 1, y: mouse[1] - 1};

                // if a dragline exists and we are in create mode... follow the mouse ;-)
                if (_g.components.dragline !== false && _g.components.dragline.beeingDragged === true) {
                    _g.components.dragline
                        .attr('x2', d3.mouse(this)[0] - 2)
                        .attr('y2', d3.mouse(this)[1] - 2);

                    _g.components.cursor.classed('hidden', true);
                }

                // move the cursor on the graph when it is enabled
                if (_g.components.cursor !== false) {
                    _g.components.cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
                }
            });

        _g.force = d3.layout.force()
            .nodes([]).links([])
            .charge(-200).linkDistance(80).size([_g.width, _g.height])
            .on('tick', _g.tick);

        _g.links = _g.force.links();
        _g.link  = _g.svg.selectAll(".link");
        _g.nodes = _g.force.nodes();
        _g.node  = _g.svg.selectAll(".node", function (d) { return d._id; });
        _g.gnode = _g.svg.selectAll(".gnode");

        // add arrow marker
        GraphComponents.createArrowMarker(_g);

        // differentiate dblclick an click events
        var down,
            tolerance = 5,
            last,
            wait = null;

        // var graph = {
        //     nodes: [
        //         {x: 250, y: 200, _properties: {_id: 16, name:"yo"}, _id: null, _labels: []},
        //         {x: 250, y: 200, _properties: {_id: 16, name:"yo"}, _id: null, _labels: []},
        //     ],
        //     links: [
        //         { source: 0, target: 1 },
        //     ],
        // }

        _g.force
            .drag()
            // .origin(function(d) { return {x: d.x, y: d.y}; })
            .on('dragstart', function (d) {
                if (_g.state.dragging === false) {
                    return null;
                }
                // save first mouse position
                _g.events.dragstartPosition = _g.events.dragPosition;

            }).on('drag', function (d) {
                // id currently dragging and in create mode, prevent
                // new nodes to be added when mouse event id down/up
            }).on('dragend', function (d) {
                // reset the dragged element (no element is beeing dragged)

                // save end mouse position
                _g.events.dragendPosition = _g.events.dragPosition;

                if (_g.state.preventDrag === false) {
                    d3.select(this).classed('fixed', d.fixed = true);
                }


            });


        /**
         * Add a node to the graph.
         * @param object A formatted node object from the Neo4j\Factory
         */
        _self.addNode = function (node, update, coordinates) {
            if (typeof(update) == 'undefined') { var update = true; };

            // add x and y coordinates just to avoid bouging the graph too much (not required)
            if (typeof(coordinates) === 'undefined') {
                node.x = 200;
                node.y = 250;
            } else {
                node.x = parseInt(coordinates.x);
                node.y = parseInt(coordinates.y);
            }

            // check that the node does no alreay exists ! ;-)
            var needle = GraphHandlers.findNodeById(_g, node._id);
            if (needle) {
                return false;
            }

            // add the nodes to the graph
            _g.nodes.push(node);

            if (true === update) {
                _self.update();
            }

            return true;
        };

        /**
         * Add a node to the graph.
         * @param object A formatted node object from the Neo4j\Factory
         */
        _self.updateNode = function (node, update) {
            if (typeof(update) == 'undefined') { var update = true; };

            // get existing node
            var needle = GraphHandlers.findNodeById(_g, node._id);
            if (false === needle) {
                return false;
            }

            _self.removeNodeByIndex(needle.index);

            _g.nodes.push(node);

            if (true === update) {
                _self.update();
            }

            return true;
        };

        /**
         * Add a node to the graph.
         * @param object A formatted node object from the Neo4j\Factory
         */
        _self.removeNodeByIndex = function (index, update) {
            if (typeof(update) == 'undefined') {
                var update = true;
            }

            _g.nodes.splice(index, 1); // remove node

            if (true === update) {
                _self.update();
            }

            return true;
        };

        /**
         * Add a node to the graph.
         * @param object A formatted node object from the Neo4j\Factory
         */
        _self.addLink = function (relationship) {
            // find both nodes
            var sourceNeedle = GraphHandlers.findNodeById(_g, relationship._source._id);
            var targetNeedle = GraphHandlers.findNodeById(_g, relationship._target._id);

            // if target node does not exist we need to add it !
            if (!targetNeedle) {
                _self.addNode(relationship._target, true);
                targetNeedle = GraphHandlers.findNodeById(_g, relationship._target._id);
            }

            var link = {
                source: sourceNeedle.index,
                target: targetNeedle.index,
            };

            _g.links.push(link);
            _self.update();

            return true;
        };

        /**
         * Update and refresh the whole graph.
         */
        _self.update = function () {
            _g.link  = _g.link.data(_g.links);
            _g.node  = _g.node.data(_g.nodes, function (d) { return d._id; });
            
            _g.link.enter().append('line')
                .attr('class', 'link')
                .attr('marker-end', 'url(#arrow-marker)')
                .style('stroke-width', function(d) { return Math.sqrt(d.value); });

            _g.gnodes = _g.node.enter().append("g")
                .attr('class', 'gnode')
                .attr('data-id', function (d) { return d._id; })
                .on('mouseover', function (d) {
                    // on hover, never display the cursor of the create mode
                    if (_g.state.create === true) {
                        _g.components.cursor.classed('hidden', true);
                    }
                })
                .on('mouseout', function (d) {
                    if (_g.state.create === true) {
                        _g.components.cursor.classed('hidden', false);
                    }
                })
                .on('mousedown', function (d) {
                    if (_g.state.create === true) {
                        // prevent the drag method to be fired
                        d3.event.stopPropagation();
                        return;
                    }
                    down = d3.mouse(document.body);
                    last = +new Date();
                    _g.state.preventDrag = true;
                    _g.svg.selectAll('.gnode').classed('selected', false); // remove all nodes selected class
                })
                .on('mouseup', function (d) {
                    if (_g.state.create === true) {
                        // then prevent simple clicks on node
                        return;
                    }
                    var element = d3.select(this);
                    // if (d3.event.defaultPrevented) {
                    //
                    // }
                    if (GraphUtilities.distance(down, d3.mouse(document.body)) > tolerance) {
                        _g.state.preventDrag = false;
                        return;
                    } else {
                        if (wait) {
                            window.clearTimeout(wait);
                            wait = null;
                            $(_g.selector).trigger('node:dblclick', [d]);
                        } else {
                            wait = window.setTimeout((function(e) {
                                return function() {
                                    $(_g.selector).trigger('node:click', [d]);
                                    // set selected node
                                    element.classed('selected', true);
                                    wait = null;
                                };
                            })(d3.event), 300);
                        }
                    }
                })
                .classed('draggable', true)
                .call(_g.force.drag)
            ;

            _g.link.exit().remove();
            _g.node.exit().remove();

            _g.gnodes.append("circle")
                .attr('class', 'ring')
                .attr("r", 23);

            _g.gnodes.append("circle")
                .attr('data-id', function (d) { return d._id; })
                .attr('class', function (d) {
                    var klass = "node";
                    // find color
                    if (d._labels.length > 0) {
                        var firstLabel = d._labels[0];
                        if (typeof(Settings.graph.label.colors[firstLabel]) !== 'undefined') {
                            var color = Settings.graph.label.colors[firstLabel];
                            klass += " "+color;
                        }
                    }
                    return klass;
                })
                .attr("r", 20)
            ;

            _g.gnodes.append('text')
                .attr('class', 'label')
                .text(function(d) {
                    var idField  = Settings.graph._id;
                    var prop = Settings.graph.primaryLabel;

                    return d._properties.name;
                    // if (typeof(d._properties[prop]) === 'undefined') {
                    //     return d[idField];
                    // } else {
                    //     return d._properties[prop];
                    // }
                });

            _g.force.start();
        };

        /**
         * Happens when right clicking on a graph node.
         * @todo Unused at the moment
         */
        _self.onRightClick = function () {
            d3.event.preventDefault();
        };

        /**
         * Bind general UI elements
         */
        // _self.bindInterface = function () {
        //     $('a[data-toggle="create-mode"]').unbind('click').bind('click', function (e) {
        //         var mode = $(this).attr('data-mode');
        //         e.preventDefault();
        //
        //         if (mode === 'off') {
        //             $(this).find('i').removeClass('fa-rotate-180');
        //             $(this).attr('data-mode', 'on');
        //             _self.enableCreateMode();
        //         } else if (mode === 'on') {
        //             $(this).attr('data-mode', 'off');
        //             $(this).find('i').addClass('fa-rotate-180');
        //             _self.disableCreateMode();
        //         } else {
        //             // yeah, error occured, but practically impossible
        //         }
        //     });
        // };

        /**
         * Initialiser everything.
         */
        _self.init = function () {
            _self.update();
            // _self.bindInterface();
        };

        /**
         * Enable create mode ON
         */
        _self.enableCreateMode = function () {
            _g.state.create = true;

            // create a cursor element (dragline is creted by a drag action start when on create mode)
            _g.components.cursor = GraphComponents.create('Cursor', _g);

            d3.selectAll('g.gnode').classed('cell', true);

            _self.disableDragging();
            $(_g.selector).trigger('graph.create:enable', []);
        }

        /**
         * Enable create mode ON
         */
        _self.disableCreateMode = function () {
            _g.state.create = false;

            _g.components.cursor.remove();
            _g.components.cursor = false;

            if (_g.components.dragline !== false) {
                _g.components.dragline.remove();
                _g.components.dragline = false;
            }

            d3.selectAll('g.gnode').classed('cell', false);

            _self.enableDragging();
            $(_g.selector).trigger('graph.create:disable', []);
        }

        /**
         * Enables node dragging
         */
        _self.enableDragging = function () {
            _g.state.dragging = true;

            // try {
                d3.selectAll('g.gnode')
                    .on('touchstart.drag', _g.events.memory.touchstartDrag)
                    .on('mousedown.drag', _g.events.memory.mousedownDrag)
                    .call(_g.force.drag);
            // } catch (e) {
            //     console.log('@todo Remove that ugly try/catch and handle the error. It happens when crete mode is enabled with no node on the graph?')
            // }

        };

        /**
         * Disable node draggins
         */
        _self.disableDragging = function () {
            _g.state.dragging = false;
            // save all events to re-attach them later

            // save previous default drag event in memory to be re-enabled when
            //  create mode will be deactivated by the user
            _g.events.memory = {
                touchstartDrag: d3.selectAll('g.gnode').on('touchstart.drag'),
                mousedownDrag: d3.selectAll('g.gnode').on('mousedown.drag'),
            }

            // attach new event handlers to drag events to create
            // relationships and prevent default drag event
            d3.selectAll('g.gnode')
                .on('touchstart.drag', function (e) {
                    // nothing to do here
                })
                .on('mousedown.drag', function (d) {
                    GraphHandlers.onGraphRelationshipDragstart(d, _g)
                });
            ;
        };

        /**
         * Tells you if dragging is enabled
         */
        _self.isDraggingEnabled = function () {
            return _g.state.dragging;
        };

        /**
         * Initialiser everything.
         */
        _self.$ = $(_g.selector);

        return _self;
    };
});
